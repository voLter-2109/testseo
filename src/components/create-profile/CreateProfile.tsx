/* eslint-disable @typescript-eslint/naming-convention */

import { useIsFetching, useQuery, useQueryClient } from '@tanstack/react-query';
import classNames from 'classnames';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import toast from 'react-hot-toast';
import { NavLink, useNavigate } from 'react-router-dom';
import { Options } from 'react-select';
import { CSSTransition, SwitchTransition } from 'react-transition-group';

import {
  addDiploma,
  addSpecialization,
  deleteDiploma,
  deleteSpecialization,
  getAcademiesList,
  getSpecializationsList,
  updateCurrentDoctor,
} from '../../api/doctor/doctors';
import useUserStore from '../../store/userStore';
import CustomSelect from '../../ui/inputs/select/CustomSelect';

import { updateCurrentUser } from '../../api/user/user';
import {
  FILE_FORMAT_FOR_DIPLOMA_SUCCESS,
  PROFILE_UPDATE_SUCCESSFUL_MESSAGE,
} from '../../constant/infoTooltipMessages';
import { DoctorInfo, DoctorInfoSend } from '../../types/doctor/doctor';
import { IUserProfile, UserInfoSend } from '../../types/user/user';

import useWindowResize from '../../hooks/useWindowResize';
import InputDate from '../../ui/inputs/input-date/InputDate';
import InputNickName from '../../ui/inputs/input-nick-name/InputNickName';
import InputText from '../../ui/inputs/input-text/InputText';
import SingleValues from '../../ui/inputs/select/select.type';

import ExitButton from '../../ui/exit-button/ExitButton';
import CustomTextarea from '../../ui/inputs/custom-textarea/CustomTextarea';
import InputFile from '../../ui/inputs/input-file/InputFile';
import takeAwayDate from '../../utils/takeAwayDate';
import LinkMobileCheck from '../link-mobile-check/LinkMobileCheck';

import {
  QKEY_GET_ALL_ACADEMY,
  QKEY_GET_ALL_SPECIALIZATION,
  QKEY_GET_DOCTOR,
  QKEY_GET_USER,
} from '../../constant/querykeyConstants';

import GlobalLoading from '../../ui/suspense-loading/GlobalLoading';

import SpecializationArray from '../../ui/inputs/specialization-array/SpecializationArray';
import Form from '../form/Form';
import { IDefaultFormProps } from '../form/test.type';

import CustomButton from '../../ui/custom-button/Button';

import InputCheckbox from '../../ui/inputs/input-checkbox/InputCheckbox';

import InputEmail from '../../ui/inputs/input-email/InputEmail';

import style from './createProfile.module.scss';

const defaultValueForm: IDefaultFormProps = {
  user: {
    is_doctor: false,
    phone: '',
    city_id: null,
    country: null,
    gender: null,
    email: '',
    birthday: null,
    patronymic: '',
    last_name: '',
    first_name: '',
    nickname: '',
    additional_information: '',
  },
  doctor: {
    seniority: 0,
    academy: null,
    rank: '',
    scientific_degree: '',
    category: '',
    work_place: '',
    career_start_date: null,
    about_me: null,
  },
  specialization: {
    specialization: [],
    delete_specialization: [],
  },
  diploma: {
    diploma: null,
    diplomaNew: null,
  },
};

function isObject(item: any): item is object {
  return item && typeof item === 'object' && !Array.isArray(item);
}
// Функция для возвращения ключей:
function getInterfaceKeys<T extends object>(obj: T): readonly (keyof T)[] {
  return Object.keys(obj) as Array<keyof T>;
}

function mergeObjects<T extends object, U extends object>(
  target: T,
  source: U,
  excludeKeys: Array<keyof any> = [] // Используем 'keyof any' чтобы обеспечить поддержку всех возможных ключей
): T & Partial<U> {
  (Object.keys(source) as Array<keyof U>).forEach((key) => {
    if (excludeKeys.includes(key)) {
      return; // Пропускаем ключи, которые нужно исключить
    }

    const sourceValue = source[key];

    if (
      key in target &&
      isObject(sourceValue) &&
      isObject((target as any)[key])
    ) {
      // Если оба значения являются объектами, рекурсивно объединяем их
      mergeObjects((target as any)[key], sourceValue, excludeKeys);
    } else if (key in target) {
      // В других случаях просто присваиваем значение
      (target as any)[key] = sourceValue;
    }
  });

  return target;
}

const CreateProfile = () => {
  const [successCheckNickName, setSuccessCheckNickName] =
    useState<boolean>(true);
  const { user, doctor } = useUserStore((state) => state);
  const [isDoctorCheck, setIsDoctorCheck] = useState<boolean>(
    user?.is_doctor || false
  );
  const [isFirstRender, setIsFirstRender] = useState(true);
  const { tableMini, mobileL } = useWindowResize();
  const nodeRef = useRef<any>(null);
  const queryClient = useQueryClient();
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);

  const isFilled = useMemo(() => {
    if (user && user.is_filled) {
      return user.is_filled;
    }

    return false;
  }, []);

  const navigate = useNavigate();

  const notifySuccess = (test: string, dur: number = 3000) =>
    toast.success(test, {
      duration: dur,
      style: {
        minWidth: '350px',
      },
    });
  const notifyError = (text: string) =>
    toast.error(text, {
      duration: 4000,
    });

  useEffect(() => {
    setIsFirstRender(true);
  }, []);

  const handleSubmit = async (
    newResData: IDefaultFormProps,
    defaultValuesForm: IDefaultFormProps
  ) => {
    const promises: Promise<any>[] = [];
    setSubmitLoading(true);
    // oldValue === def - default data переданное изначально в form
    // newValue === newResData - нова дата переданная из формы
    const userSubmitData: Partial<UserInfoSend> = {};
    const userSubmitDataArray = getInterfaceKeys(defaultValueForm.user);
    const doctorSubmitData: Partial<DoctorInfoSend> = {};
    const doctorSubmitDataArray = getInterfaceKeys(defaultValueForm.doctor);

    // ! проскакивает any
    // 1. Обновляем данные пользователя
    if (newResData.user) {
      userSubmitDataArray.forEach((key) => {
        const oldValue = defaultValuesForm.user[key];
        const newValue = newResData.user[key];

        if (key === 'birthday' && typeof newValue === 'string') {
          const timeN = new Date(newValue).getTime();

          if (timeN && oldValue !== +timeN / 1000) {
            Object.assign(userSubmitData, { [key]: +timeN / 1000 });
          }
        } else if (newValue && oldValue !== newValue && key !== 'is_doctor') {
          Object.assign(userSubmitData, { [key]: newValue });
        }

        if (key === 'patronymic' && oldValue !== newValue) {
          Object.assign(userSubmitData, { [key]: newValue });
        }
      });
      console.log(userSubmitData);
    }

    // доктор для редактирования 1115468567

    // 2. Обновляем данные доктора, если пользователь доктор
    if (newResData.user.is_doctor) {
      doctorSubmitDataArray.forEach((key) => {
        const oldValue = defaultValuesForm.doctor[key];
        const newValue = newResData.doctor[key];

        if (key === 'career_start_date' && typeof newValue === 'string') {
          const timeN = new Date(newValue).getTime();

          if (timeN && oldValue !== +timeN / 1000) {
            Object.assign(doctorSubmitData, { [key]: +timeN / 1000 });
          }
        } else if (oldValue !== newValue) {
          Object.assign(doctorSubmitData, { [key]: newValue });
        }
      });
    }

    // 3. Формируем список промисов

    // Запрос на обновление данных пользователя
    if (Object.keys(userSubmitData).length) {
      console.log(userSubmitData);
      updateCurrentUser(userSubmitData);
      promises.push(
        updateCurrentUser(userSubmitData)
          // .then(() => {
          //   notifySuccess('персональные данные обновлены');
          // })
          .catch((e) => {
            console.log(e);
          })
      );
    }

    // Запрос на обновление данных доктора
    if (Object.keys(doctorSubmitData).length && isDoctorCheck) {
      console.log(doctorSubmitData);
      promises.push(
        updateCurrentDoctor(doctorSubmitData)
          // .then(() => {
          //   notifySuccess('данные доктора обновлены');
          // })
          .catch((e) => {
            console.log(e);
          })
      );
    }

    // ! подумать как обрабатывать запросы в определенной очередности
    // ! и выводить ошибки по порядку

    // 4. Обработка дипломов
    try {
      if (newResData.diploma.diplomaNew && isDoctorCheck) {
        // создаем запрос на добавление диплома но сначала надо удалить прошлый
        const req = addDiploma(newResData.diploma.diplomaNew[0])
          // .then(() => {
          //   notifySuccess('диплом добавлен');
          // })
          .catch((e) => {
            console.log(e);
          });

        if (
          defaultValuesForm.diploma.diploma &&
          defaultValuesForm.diploma.diploma[0]
        ) {
          const diplomaId = defaultValuesForm.diploma.diploma[0].id;

          // Удаляем старый диплом и добавляем в массив промисов новый на добавление
          await deleteDiploma(diplomaId).then(() => {
            promises.push(req);
          });
        } else {
          promises.push(req);
        }
      }

      // 5. Удаление специализаций
      // ! так же нужно сначала удалить а потом уже добавлять новые
      if (
        newResData.specialization.delete_specialization &&
        newResData.specialization.delete_specialization.length &&
        isDoctorCheck
      ) {
        newResData.specialization.delete_specialization.forEach(
          (spec: number) => {
            promises.push(
              deleteSpecialization(spec)
                // .then(() => {
                //   notifySuccess('специализации успешно удалены');
                // })
                .catch((e) => {
                  console.log(e);
                })
            );
          }
        );
      }

      // 6. Добавление специализаций
      if (
        newResData.specialization &&
        newResData.specialization.specialization &&
        isDoctorCheck
      ) {
        newResData.specialization.specialization.forEach((spec) => {
          if (!spec.oldEntry && spec.new_file && spec.specialization_id) {
            const { new_file, expiration_date, specialization_id } = spec;
            const timeN = new Date(expiration_date).getTime() / 1000;
            const newSpec = {
              specialization_id,
              file: new_file[0],
              expiration_date: timeN,
            };
            console.log(newSpec);

            promises.push(
              addSpecialization(newSpec)
                // .then(() => {
                //   notifySuccess('специализация успешно добавлена');
                // })
                .catch((e) => {
                  console.log(e);
                })
            );
          }
        });
      }

      // 7. Выполнение всех запросов
      if (promises.length) {
        await Promise.all(promises)
          .then((res) => {
            console.log(res);
            notifySuccess(PROFILE_UPDATE_SUCCESSFUL_MESSAGE);
            queryClient.invalidateQueries({ queryKey: [QKEY_GET_USER] });

            if (newResData.user.is_doctor) {
              queryClient.invalidateQueries({
                queryKey: [QKEY_GET_DOCTOR],
              });
              queryClient.fetchQuery({
                queryKey: [QKEY_GET_DOCTOR],
              });
            }
          })
          .then(() => {
            const navigateUrl = () => {
              if (mobileL) {
                return navigate('/m');
              }

              return navigate('/');
            };
            // если все удачно, то перекинуть на главную страницу
            if (!isFilled) {
              navigateUrl();
            } else {
              setTimeout(() => {
                navigateUrl();
              }, 2000);
            }
          })
          .then(() => {
            setSubmitLoading(false);
          });
      }
    } catch (error: any) {
      console.log(error);
      if (
        error &&
        error.response &&
        Object.prototype.hasOwnProperty.call(error.response, 'data')
      ) {
        const errorObj: string[] = Object.values(error.response.data);

        errorObj.forEach((e: string) => {
          notifyError(e);
        });
      }
    }
  };

  // совмещает оба обекта user doctor для дефолтного значения в форме
  const getNewProfile = useCallback(
    (
      userProfile: IUserProfile,
      doctorProfile: DoctorInfo | null
    ): IDefaultFormProps => {
      const newProfile: IDefaultFormProps = defaultValueForm;

      const mergedUserProfile = mergeObjects(newProfile.user, userProfile, [
        'birthday',
      ]);
      newProfile.user = mergedUserProfile;

      if (userProfile.birthday) {
        newProfile.user.birthday = new Date(userProfile.birthday * 1000)
          .toISOString()
          .substring(0, 10);
      }

      if (doctorProfile) {
        const mergedDoctorProfile = mergeObjects(
          newProfile.doctor,
          doctorProfile,
          ['specialization', 'diploma', 'academy', 'career_start_date']
        );
        newProfile.doctor = mergedDoctorProfile;

        if (doctorProfile.career_start_date) {
          newProfile.doctor.career_start_date = new Date(
            doctorProfile.career_start_date * 1000
          )
            .toISOString()
            .substring(0, 10);
        }

        newProfile.diploma = {
          diploma: doctorProfile.diploma,
          diplomaNew: null,
        };

        if (
          doctorProfile.specialization &&
          doctorProfile.specialization.length
        ) {
          const spec = doctorProfile.specialization.map((item) => {
            return {
              ...item,
              expiration_date: new Date(item.expiration_date * 1000)
                .toISOString()
                .substring(0, 10),
              oldEntry: true,
              is_delete: false,
              new_file: null,
            };
          });
          newProfile.specialization = {
            specialization: spec,
            delete_specialization: [],
          };
        }

        if (doctorProfile.academy && doctorProfile.academy_label) {
          newProfile.doctor.academy = doctorProfile.academy;
        }
      }

      return newProfile;
    },
    []
  );

  // список для выбора гендера
  const genderListOptions: Options<SingleValues> = [
    { value: 'male', label: 'Мужчина' },
    { value: 'female', label: 'Женщина' },
  ];

  // * данный блок относится к получению академий
  const [academyListOptions, setAcademyListOptions] = useState<SingleValues[]>(
    []
  );

  const [specializationListOptions, setSpecializationListOptions] = useState<
    SingleValues[]
  >([]);

  const { data: academyList, isSuccess: academySuccess } = useQuery({
    queryKey: [QKEY_GET_ALL_ACADEMY],
    queryFn: () => getAcademiesList(),
    select({ data }) {
      return data.map((spec) => {
        return {
          value: `${spec.id}`,
          label: `${spec.name}`,
        };
      });
    },
  });

  const { data: specializationDataList, isSuccess: specializationSuccess } =
    useQuery({
      queryKey: ['get all specialization'],
      queryFn: () => getSpecializationsList(),
      retry: false,
      select({ data }) {
        const newData = data.map((spec) => {
          return {
            value: `${spec.id}`,
            label: `${spec.name}`,
          };
        });

        return newData.reverse();
      },
    });

  useEffect(() => {
    if (academyList?.length && academySuccess)
      setAcademyListOptions(academyList);
  }, [academyList, academySuccess]);

  useEffect(() => {
    if (specializationDataList?.length && specializationSuccess)
      setSpecializationListOptions(specializationDataList);
  }, [specializationDataList, specializationSuccess]);

  const isFetchingUser = useIsFetching({ queryKey: [QKEY_GET_DOCTOR] });
  const isFetchingDoctor = useIsFetching({ queryKey: [QKEY_GET_USER] });
  const isFetchingAcademy = useIsFetching({ queryKey: [QKEY_GET_ALL_ACADEMY] });
  const isFetchingSpec = useIsFetching({
    queryKey: [QKEY_GET_ALL_SPECIALIZATION],
  });

  if (
    !isFirstRender &&
    (isFetchingDoctor || isFetchingUser || isFetchingAcademy || isFetchingSpec)
  ) {
    return <GlobalLoading />;
  }

  return (
    <div className={style.createProfile}>
      {!tableMini && (
        <div className={style.left}>
          <div />
          <SwitchTransition mode="out-in">
            <CSSTransition
              nodeRef={nodeRef}
              addEndListener={(done: () => void) => {
                nodeRef.current?.addEventListener('transitionend', done, false);
              }}
              classNames="fade"
              key={isDoctorCheck ? 'doctor' : 'patient'}
            >
              <div
                ref={nodeRef}
                className={classNames(style.registrationBlock)}
              >
                {isDoctorCheck ? (
                  <div className={classNames(style.iconDoctor, style.icon)} />
                ) : (
                  <div className={classNames(style.iconPatient, style.icon)} />
                )}
                <LinkMobileCheck to="">
                  <CustomButton classNameBtn={style.btn} styleBtn="secondary">
                    На главную
                  </CustomButton>
                </LinkMobileCheck>

                {user && !user.is_filled && <ExitButton />}
              </div>
            </CSSTransition>
          </SwitchTransition>
        </div>
      )}
      <div className={style.content}>
        {tableMini ? (
          <>
            {!mobileL && !user?.is_filled && <ExitButton />}
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                gap: '10px',
                justifyContent: 'center',
              }}
            >
              <NavLink to="/" title="вернуться назад">
                &larr;
              </NavLink>
              <h2 className={style.heading}>
                {isFilled ? 'Редактирование профиля' : 'Регистрация'}
              </h2>
            </div>
          </>
        ) : (
          <h2 className={style.heading}>
            {isFilled ? 'Редактирование профиля' : 'Регистрация'}
          </h2>
        )}

        <div className={style.contentBlock}>
          <Form
            successCheckNickName={successCheckNickName}
            className={style.createUserForm}
            onHandleSubmit={handleSubmit}
            isLoadingBtn={submitLoading}
            reValidateMode="onSubmit"
            defaultValuesForm={
              (user && getNewProfile(user, doctor)) || defaultValueForm
            }
            submitTextForBtn="Сохранить"
            mode="onSubmit"
            schema={undefined}
          >
            <div
              style={{
                borderLeft: '1px solid grey',
                width: '100%',
                paddingLeft: '15px',
              }}
            >
              <InputText name="user.last_name" label="Фамилия" requiredLabel />
              <InputText name="user.first_name" label="Имя" requiredLabel />
              <InputText name="user.patronymic" label="Отчество" />
              <InputDate
                onOldValidating
                name="user.birthday"
                label="Дата рождения"
                requiredLabel
                minDate="1970-01-02"
                min="1970-01-02"
                maxDate={takeAwayDate(18, '-')}
                max={takeAwayDate(18, '-')}
                career={false}
              />
              <ErrorBoundary fallback={<div>Something went wrong</div>}>
                <InputNickName
                  name="user.nickname"
                  label="Логин"
                  requiredLabel
                  successCheckNickName={successCheckNickName}
                  setSuccessCheckNickName={setSuccessCheckNickName}
                />
              </ErrorBoundary>
              <InputEmail name="user.email" label="Email" />
              <CustomSelect
                name="user.gender"
                placeholder="Выбор..."
                label="Пол"
                requiredLabel={false}
                options={genderListOptions}
              />
              <InputCheckbox
                name="user.is_doctor"
                setIsDoctorCheck={setIsDoctorCheck}
                userIsDoctor={user?.is_doctor}
              >
                <div className={style.description}>
                  <p>Я врач</p>
                  <p>Если вы не врач, не отмечайте данный пункт.</p>
                </div>
              </InputCheckbox>
            </div>

            {isDoctorCheck && (
              <>
                <p>Образование</p>
                <hr />

                <div
                  style={{
                    borderLeft: '1px solid grey',
                    width: '100%',
                    paddingLeft: '15px',
                  }}
                >
                  <CustomSelect
                    name="doctor.academy"
                    options={academyListOptions}
                    label="Место учебы"
                    placeholder="Выбор..."
                    requiredLabel
                  >
                    <InputFile
                      accept={FILE_FORMAT_FOR_DIPLOMA_SUCCESS.join()}
                      name="diploma.diplomaNew"
                      oldFile="diploma.diploma.0"
                      label="Диплом"
                      requiredLabel
                    />
                  </CustomSelect>
                </div>
                <p>Специализация</p>
                <hr />
                <div
                  style={{
                    borderLeft: '1px solid grey',
                    width: '100%',
                    paddingLeft: '15px',
                  }}
                >
                  <SpecializationArray
                    specializationDataList={specializationListOptions}
                  />
                </div>
                <p>Дополнительная информация</p>
                <hr />
                <div
                  style={{
                    borderLeft: '1px solid grey',
                    width: '100%',
                    paddingLeft: '15px',
                  }}
                >
                  <CustomTextarea
                    name="doctor.work_place"
                    placeholder="Город, адрес, название организации"
                    label="Место работы"
                  />
                  <InputDate
                    name="doctor.career_start_date"
                    onOldValidating={false}
                    label="Дата начала трудовой деятельности"
                    minDate="1988-01-02"
                    min="1988-01-02"
                    maxDate={takeAwayDate(0, '-')}
                    max={takeAwayDate(0, '-')}
                    career
                  />
                  <CustomTextarea
                    style={{
                      minHeight: '200px',
                    }}
                    name="doctor.about_me"
                    label="О себе"
                    placeholder="Расскажите о себе и вашем опыте"
                  />
                </div>
              </>
            )}
          </Form>
        </div>
      </div>
    </div>
  );
};

export default CreateProfile;

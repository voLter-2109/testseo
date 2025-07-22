import classNames from 'classnames';
import { FC, useCallback, useEffect } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import {
  IDefaultFormProps,
  INewSpec,
} from '../../../components/form/test.type';
import CustomSelect from '../select/CustomSelect';

import Divider from '../../divider/Divider';

import { ReactComponent as Like } from '../../../assets/create-profile/like.svg';
import { FILE_FORMAT_FOR_DIPLOMA_SUCCESS } from '../../../constant/infoTooltipMessages';
import InputDate from '../input-date/InputDate';
import InputFile from '../input-file/InputFile';

import takeAwayDate from '../../../utils/takeAwayDate';

import style from './specialization.module.scss';

// инициализация нового обьекта в массиве специализаций
const initialSpecialization: INewSpec = {
  file: '',
  oldEntry: false,
  expiration_date: '',
  specialization_id: null,
  is_delete: false,
  created_at: 0,
  file_url: '',
  is_moderated: false,
  name: '',
  new_file: null,
  title: '',
};

interface Props {
  specializationDataList:
    | {
        value: string;
        label: string;
      }[]
    | undefined;
}

// login 8765456789 no full field

const SpecializationArray: FC<Props> = ({ specializationDataList }) => {
  const { getValues, setValue, control, trigger, watch, unregister } =
    useFormContext<IDefaultFormProps>();

  const fieldsNameArray = 'specialization.specialization';

  const { fields, append, update, remove } = useFieldArray({
    name: fieldsNameArray,
    control,
    keyName: 'uniqueId',
  });

  const specializationIds = watch('specialization.specialization', fields).map(
    (field) => {
      if (field.specialization_id) return +field.specialization_id;

      return -1;
    }
  );

  useEffect(() => {
    return () => {
      unregister(fieldsNameArray, { keepIsValid: true });
    };
  }, []);

  const test = useCallback(
    (def: number | null) => {
      if (specializationDataList) {
        const y = specializationDataList.filter((item) => {
          return (
            !specializationIds.includes(+item.value) || +item.value === def
          );
        });
        return y;
      }
      return [];
    },
    [specializationIds, specializationDataList]
  );

  useEffect(() => {
    if (fields.length === 0) append(initialSpecialization);
  }, [fields.length]);

  const handleAppendSpecialization = () => {
    append(initialSpecialization);
  };

  const handleRemoveSpecialization = async (index: number, field: INewSpec) => {
    const del = getValues('specialization.delete_specialization');

    // если это старая запись то добавить ее в список на удаление
    if (field.specialization_id && field.oldEntry) {
      setValue('specialization.delete_specialization', [
        field.specialization_id,
        ...del,
      ]);
    }

    update(index, initialSpecialization);
    remove(index);

    await trigger(`specialization`);
  };

  return (
    <div
      style={{
        marginBottom: '20px',
      }}
    >
      <div>
        {fields.map((field, index) => (
          <div
            key={field.uniqueId}
            style={{
              marginBottom: '15px',
            }}
          >
            <CustomSelect
              name={`specialization.specialization.${index}.specialization_id`}
              options={test(field.specialization_id)}
              label="Специализация"
              placeholder="Выбор..."
              requiredLabel
              disableOptions={Boolean(field.oldEntry)}
            />
            <InputFile
              id={`specialization.specialization[${index}].file`}
              accept={FILE_FORMAT_FOR_DIPLOMA_SUCCESS.join()}
              label="Сертификат"
              requiredLabel
              checkInputRequiredForSpec={Boolean(field.file)}
              name={`specialization.specialization.${index}.new_file`}
              disableOptions={Boolean(field.oldEntry)}
            />
            {Boolean(field.oldEntry) && (
              <>
                <p>Ранее загруженный файл:</p>
                <div className={style.oldFile}>
                  <p
                    className={classNames({
                      [style.noModerate]: !field.is_moderated,
                    })}
                  >
                    <Like
                      className={classNames(style.moderate)}
                      title={
                        field.is_moderated
                          ? 'модерация пройдена'
                          : 'модерации не пройдена'
                      }
                    />
                  </p>
                  <a
                    className={(style.moderate, style.click)}
                    href={field.file_url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {field.file &&
                      Boolean(typeof field.file === 'string') &&
                      field.file.replace(
                        /(diplomas\/|specializations_certificates\/)/g,
                        ''
                      )}
                  </a>
                </div>
              </>
            )}
            <InputDate
              id={`specialization.specialization[${index}].date`}
              label="Дата окончания сертификата"
              requiredLabel
              name={`specialization.specialization.${index}.expiration_date`}
              disableOptions={field.oldEntry}
              maxDate={takeAwayDate(5, '+')}
              max={takeAwayDate(5, '+')}
              minDate={takeAwayDate(0, '-')}
              min={takeAwayDate(0, '-')}
              career={false}
            />
            {fields.length > 1 && (
              <button
                className={style.addBtn}
                type="button"
                onClick={() => {
                  handleRemoveSpecialization(index, field);
                }}
              >
                Удалить специализацию
              </button>
            )}
            <Divider />
          </div>
        ))}

        {fields.length < 5 && (
          <div className={style.btnBlock}>
            <button
              className={style.addBtn}
              type="button"
              onClick={handleAppendSpecialization}
            >
              Добавить еще одну
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpecializationArray;

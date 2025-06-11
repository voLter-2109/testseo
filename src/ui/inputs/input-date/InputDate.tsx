import classNames from 'classnames';
import { isWithinInterval } from 'date-fns';
import dayjs from 'dayjs';
import { FC, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import {
  REQUIRED_TEXT,
  YEARS_OLD,
} from '../../../constant/infoTooltipMessages';
import Label from '../label/Label';

import { IDefaultFormProps } from '../../../components/form/test.type';

import useYapErrorMessage from '../../../hooks/useYapErrorMessage';
import InputErrorMessage from '../error-message/InputErrorMessage';

import userStore from '../../../store/userStore';

import style from './inputDate.module.scss';

interface IInputDate extends React.InputHTMLAttributes<HTMLInputElement> {
  name:
    | 'user.birthday'
    | 'doctor.career_start_date'
    | `specialization.specialization.${number}.expiration_date`;
  label?: string;
  maxDate: string;
  minDate: string;
  requiredLabel?: boolean;
  disableOptions?: boolean;
  onOldValidating?: boolean;
  career?: boolean;
}

const InputDate: FC<IInputDate> = ({
  name,
  label,
  maxDate,
  minDate,
  requiredLabel,
  disableOptions,
  onOldValidating,
  career = false,
  ...InputHTMLAttributes
}) => {
  const user = userStore((state) => state.user);

  const {
    trigger,
    register,
    getValues,
    unregister,
    formState: { errors },
  } = useFormContext<IDefaultFormProps>();
  const errorMessage = useYapErrorMessage(errors, name);

  const handleChange = async () => {
    if (name === 'user.birthday') {
      await trigger('doctor.career_start_date');
    }

    await trigger(name);
  };

  useEffect(() => {
    if (user?.is_filled) {
      trigger();
    }
  }, []);

  useEffect(() => {
    return () => {
      unregister(name, { keepIsValid: true });
    };
  }, []);

  return (
    <>
      <div className={style.wrapper}>
        {label && <Label label={label} required={requiredLabel} />}
        <div
          className={classNames(style.wrapperInput, {
            [style.error]: errorMessage,
          })}
        >
          <input
            min="1970-01-02"
            lang="ru"
            {...register(name, {
              required: disableOptions
                ? false
                : requiredLabel
                  ? REQUIRED_TEXT
                  : false,
              validate: {
                oldest: (value: string | null) => {
                  if (!value) return true;
                  if (!onOldValidating) return true;

                  const date = dayjs();
                  const newDate = dayjs(value).format('YYYY-MM-DD');
                  const yearsDifference = date.diff(newDate, 'years');

                  return yearsDifference >= 18 || YEARS_OLD;
                },
                range: (v: string | null) => {
                  // если поле не заполнено, то валидация не требуется
                  if (!v) return true;
                  if (career) return true;
                  const min = new Date(minDate);
                  const max = new Date(maxDate);
                  const localMinDate = new Date(minDate).toLocaleDateString();
                  const localMaxDate = new Date(maxDate).toLocaleDateString();
                  return (
                    isWithinInterval(new Date(v), {
                      start: min,
                      end: max,
                    }) ||
                    `Допустимый диапазон ${localMinDate} - ${localMaxDate}`
                  );
                },
                career: (value: string | null) => {
                  if (!value) return true;
                  if (!career) return true;

                  const dateBir = getValues('user.birthday');

                  if (!dateBir) return 'Заполните дату рождения';

                  const birthday = new Date(dateBir);
                  const careerStartDate = new Date(value);

                  const minCareerStartDate = dayjs(birthday)
                    .add(18, 'year')
                    .format('DD.MM.YYYY');

                  return (
                    careerStartDate >
                      dayjs(birthday).add(18, 'years').toDate() ||
                    `Дата должна быть не ранее ${minCareerStartDate}`
                  );
                },
              },
              onChange: handleChange,
            })}
            disabled={disableOptions}
            id={name}
            pattern="[0-9]{2}-[0-9]{2}-[0-9]{4}"
            {...InputHTMLAttributes}
            type="date"
            className={classNames(style.input)}
          />
        </div>
        {errorMessage ? (
          <InputErrorMessage errorMessage={errorMessage} />
        ) : (
          <div className={style.errorMessage} />
        )}
      </div>
    </>
  );
};

export default InputDate;

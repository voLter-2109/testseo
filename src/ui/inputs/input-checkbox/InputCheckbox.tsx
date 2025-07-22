import { FC, PropsWithChildren, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import style from './inputCheckbox.module.scss';

interface IInputCheckboxPolicy
  extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  extraClass?: string;
  setIsDoctorCheck?: React.Dispatch<React.SetStateAction<boolean>>;
  userIsDoctor?: boolean;
}

/**
 *
 * @param {string} name обязательно имя для формы
 * @description выводит просто чекбокс с галочкой
 */
const InputCheckbox: FC<PropsWithChildren<IInputCheckboxPolicy>> = ({
  children,
  extraClass = '',
  setIsDoctorCheck,
  name = 'checkbox',
  userIsDoctor,
  ...InputHTMLAttributes
}) => {
  const { register, unregister } = useFormContext();
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);

  useEffect(() => {
    if (!isCheckboxChecked && !userIsDoctor) {
      unregister('diploma.diplomaNew');
      unregister('specialization[0].file');
    }
  }, [isCheckboxChecked]);

  useEffect(() => {
    return () => {
      unregister(name, { keepIsValid: true });
    };
  }, []);

  return (
    <div className={style.conditionsWrapper}>
      <label htmlFor={InputHTMLAttributes.id} className={style.check}>
        <input
          type="checkbox"
          {...register(name, {
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
              setIsCheckboxChecked(e.currentTarget.checked);
              if (setIsDoctorCheck) {
                setIsDoctorCheck(e.currentTarget.checked);
              }
            },
          })}
          name={name}
          id={name}
          {...InputHTMLAttributes}
          className={`${style.check_input} ${extraClass}`}
        />
        <span className={style.checkbox} />
      </label>
      <div className={style.conditions}>{children}</div>
    </div>
  );
};

export default InputCheckbox;

import { FC, PropsWithChildren, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import { TypeFormRegistrationPage } from '../../../api/auth/auth.type';

import style from './inputTypeCheckboxPolicy.module.scss';

interface IInputCheckboxPolicy
  extends React.InputHTMLAttributes<HTMLInputElement> {
  name: 'is_conf_policy_accepted';
  extraClass?: string;
}

/**
 *
 * @param {string} name обязательно имя для формы
 * @description выводит просто чекбокс с галочкой
 */
const InputCheckboxPolicy: FC<PropsWithChildren<IInputCheckboxPolicy>> = ({
  children,
  extraClass = '',
  name,
  ...InputHTMLAttributes
}) => {
  const { register, unregister } = useFormContext<TypeFormRegistrationPage>();

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
          {...register(name)}
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

export default InputCheckboxPolicy;

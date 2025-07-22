import { FC, PropsWithChildren, useEffect, useMemo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import Select, { Options } from 'react-select';

import { REQUIRED_TEXT } from '../../../constant/infoTooltipMessages';

import Label from '../label/Label';

import { IDefaultFormProps } from '../../../components/form/test.type';

import useYapErrorMessage from '../../../hooks/useYapErrorMessage';
import InputErrorMessage from '../error-message/InputErrorMessage';

import SingleValues from './select.type';

import './customSelect.scss';

interface IInputText {
  name:
    | 'user.gender'
    | `specialization.specialization.${number}.specialization_id`
    | 'doctor.academy';
  label?: string;
  placeholder?: string;
  requiredLabel: boolean;
  disableOptions?: boolean;
  options: Options<SingleValues> | null;
}

const CustomSelect: FC<PropsWithChildren<IInputText>> = ({
  name,
  label,
  options,
  children,
  placeholder,
  requiredLabel,
  disableOptions,
  ...selectOptions
}) => {
  const {
    control,
    unregister,
    trigger,
    formState: { errors },
  } = useFormContext<IDefaultFormProps>();
  const errorMessage = useYapErrorMessage(errors, name);

  useEffect(() => {
    return () => {
      unregister(name, { keepIsValid: true });
    };
  }, []);

  const newOptions = useMemo(() => {
    if (options) return options;

    return [];
  }, [options]);

  console.log(errors);

  return (
    <div className="customSelectWrapper" id={name}>
      {label && <Label label={label} required={requiredLabel} />}
      <Controller
        control={control}
        rules={{
          required: {
            value: requiredLabel,
            message: REQUIRED_TEXT,
          },
        }}
        name={name}
        render={({ field: { value, onChange, ref, onBlur } }) => (
          <Select
            {...selectOptions}
            ref={ref}
            onBlur={onBlur}
            isDisabled={disableOptions}
            placeholder={placeholder}
            classNamePrefix="react-select-custom"
            options={newOptions}
            value={
              value && newOptions
                ? newOptions.find((x) => x.value === String(value))
                : value
            }
            onChange={(option) => {
              if (option && typeof option === 'object' && 'value' in option) {
                // Это SingleValues, используем option.value
                onChange(option.value);
              } else if (typeof option === 'number') {
                // Это number, используем option напрямую
                onChange(option);
              }

              trigger();
            }}
          />
        )}
      />
      {errorMessage ? (
        <InputErrorMessage errorMessage={errorMessage} />
      ) : (
        <div className="errorMessage" />
      )}
      {children}
    </div>
  );
};

export default CustomSelect;

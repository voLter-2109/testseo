import React, { FC } from 'react';

import styles from './label.module.scss';

interface LabelProps extends React.HTMLAttributes<HTMLLabelElement> {
  label: string | undefined;
  extraLabelClass?: string;
  required?: boolean;
}

/**
 *
 * @param {string} label что написать в label
 * @param {string} extraLabelClass - className
 * @param {string} children
 * @returns
 */
const Label: FC<LabelProps> = ({
  label,
  extraLabelClass,
  required = false,
  ...HTMLLabelElement
}) => {
  return label ? (
    <label
      title={required ? 'обязательное поле' : undefined}
      htmlFor={HTMLLabelElement.id}
      className={`${styles.layout} ${extraLabelClass}`}
      {...HTMLLabelElement}
    >
      {label}
      {required && <span>*</span>}
    </label>
  ) : null;
};

export default Label;

import { FC } from 'react';

import classNames from 'classnames';

import style from './spinner.module.scss';

interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: 'sm' | 'md' | 'lg';
  textLoading?: boolean;
  classNamesWheel?: string;
  classNamesLayout?: string;
  classNameContainer?: string;
  color?: 'blue' | 'white';
}

/**
 * @enum {enum} size?: 'sm' | 'lg';
 * @enum {enum} color?: 'blue' | 'white';
 * @property {string} classNamesLayout?
 * @property {boolean} textLoading? вывод текста Загрузка...
 * @property {string} classNamesWheel?
 */
const Spinner: FC<SpinnerProps> = ({
  size = 'sm',
  classNamesWheel,
  color = 'white',
  classNamesLayout,
  classNameContainer,
  textLoading = false,
  ...HTMLAttributes
}) => {
  return (
    <div className={classNames(style.container, classNameContainer)}>
      <div
        {...HTMLAttributes}
        className={classNames(style.loader, style[size], style[color])}
      />
      {textLoading && size !== 'sm' && (
        <span className={classNames(style.text, style[size])}>Загрузка...</span>
      )}
    </div>
  );
};

export default Spinner;

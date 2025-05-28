import classNames from 'classnames';
import { FC, memo, PropsWithChildren } from 'react';

import style from './customTitle.module.scss';

interface CustomTitleProps extends React.HTMLAttributes<HTMLHeadElement> {
  extraClassNames?: string;
  bold?: 'bold' | 'normal';
  size?: 'small' | 'medium' | 'large';
}

/**
 *
 * @param {enum} bold?: 'bold' | 'normal';
 * @param {enum} size?: 'small' | 'medium' | 'large';
 * @returns title - h2
 */
const CustomTitle: FC<PropsWithChildren<CustomTitleProps>> = ({
  children,
  bold = 'normal',
  size = 'medium',
  extraClassNames,
  ...HTMLHeadElement
}) => {
  console.log('перерисовка CustomTitle');
  return (
    <h2
      {...HTMLHeadElement}
      className={classNames(
        style.titleDef,
        extraClassNames,
        style[bold],
        style[size]
      )}
    >
      {children}
    </h2>
  );
};

export default memo(CustomTitle);

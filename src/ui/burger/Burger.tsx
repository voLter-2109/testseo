import classNames from 'classnames';
import { FC, memo } from 'react';

import style from './burger.module.scss';

type Props = {
  isOpen: boolean;
  handleClick: () => void;
  width?: string;
  height?: string;
};

/**
 *
 * @param handleClick функция изменения состояние
 * @param isOpen boolean
 * @param height default 30px
 * @param width default 40px
 * @returns
 */
const Burger: FC<Props> = ({
  handleClick,
  isOpen,
  height = '30px',
  width = '40px',
}) => {
  return (
    <div
      style={{
        width: `${width}`,
        height: `${height}`,
      }}
      className={classNames(style.burger, { [style.open]: isOpen })}
      onClick={handleClick}
    >
      <span />
    </div>
  );
};

export default memo(Burger);

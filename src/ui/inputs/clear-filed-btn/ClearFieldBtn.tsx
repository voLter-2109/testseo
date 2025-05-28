import classNames from 'classnames';
import { FC, memo, PropsWithChildren, useMemo } from 'react';

import { ReactComponent as ClearBtn } from '../../../assets/registration-page/сlear-btn.svg';

import style from './ClearFiledBtn.module.scss';

interface TClearFieldBtnProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  extraAfterChunkClassName?: string;
  textLabel?: string;
}

/**
 * @description кнопка удаления в input
 * @param isInputValue - boolean условие, показывать кнопку или нет
 * @param onClick - функция скорее всего от hookform - resetFields
 * @returns возвращает svg X
 */
const ClearFieldBtn: FC<PropsWithChildren<TClearFieldBtnProps>> = ({
  children,
  textLabel,
  extraAfterChunkClassName,
  ...HTMLButtonElement
}) => {
  const memoizedClearBtnIcon = useMemo(() => {
    return !children ? <ClearBtn className={style.svgIcon} /> : children;
  }, [children]);

  const memoizedClassnames = useMemo(
    () => classNames(style.clearBtn, extraAfterChunkClassName),
    [extraAfterChunkClassName]
  );
  return (
    <button
      title={textLabel || 'очистить поле'}
      aria-label={textLabel || 'очистить поле'}
      type="button"
      className={memoizedClassnames}
      onClick={HTMLButtonElement.onClick}
      {...HTMLButtonElement}
    >
      {memoizedClearBtnIcon}
    </button>
  );
};

export default memo(ClearFieldBtn);

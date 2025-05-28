import classNames from 'classnames';
import { FC, memo, useMemo } from 'react';

import { ReactComponent as Loupe } from '../../../assets/search-input/loupe.svg';
import ClearFieldBtn from '../clear-filed-btn/ClearFieldBtn';

import style from './inputSearch.module.scss';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  handleResetValue: () => void;
  extraInputClassName?: string;
  extraWrapperClassName?: string;
  extraAfterChunkClassName?: string;
  extraBeforeChunkClassName?: string;
}

const InputSearch: FC<InputProps> = ({
  extraBeforeChunkClassName,
  extraAfterChunkClassName,
  extraWrapperClassName,
  extraInputClassName,
  handleResetValue,
  ...HTMLInputElement
}) => {
  const memoizedContainerClasses = useMemo(() => {
    return classNames(style.wrapperInput, extraWrapperClassName);
  }, [extraWrapperClassName]);

  const memoizedLoupe = useMemo(
    () => (
      <Loupe className={classNames(style.before, extraBeforeChunkClassName)} />
    ),
    [extraBeforeChunkClassName]
  );
  return (
    <div className={memoizedContainerClasses}>
      {memoizedLoupe}
      <input
        id={HTMLInputElement.id}
        className={classNames(style.input, extraInputClassName)}
        {...HTMLInputElement}
      />

      {HTMLInputElement.value ? (
        <ClearFieldBtn
          extraAfterChunkClassName={style.clear}
          onClick={handleResetValue}
        />
      ) : (
        <div className={style.after} />
      )}
    </div>
  );
};

export default memo(InputSearch);

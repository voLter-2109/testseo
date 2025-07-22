import { FC } from 'react';

import style from './checkBoxMessage.module.scss';

interface Props {
  checked: boolean;
  onChange: () => void;
  selectMode: boolean;
}

const CheckBoxMessage: FC<Props> = ({ checked, onChange, selectMode }) => {
  if (!selectMode) return <div className={style.not} />;

  return (
    <>
      <div
        className={style.check}
        onClick={(e) => {
          e.stopPropagation();
          onChange();
        }}
      >
        <input
          className={style.check_input}
          id="avatar_input"
          type="checkbox"
          checked={checked}
          onChange={onChange}
          style={{ display: 'none' }}
        />
        <div className={style.checkbox} />
      </div>
    </>
  );
};

export default CheckBoxMessage;

import { memo } from 'react';

import style from './placeHolderSelectChat.module.scss';

const PlaceHolderSelectChat = () => {
  return (
    <div className={style.placeHolderSelectChat}>
      Выберите, кому бы хотели написать.
    </div>
  );
};

export default memo(PlaceHolderSelectChat);

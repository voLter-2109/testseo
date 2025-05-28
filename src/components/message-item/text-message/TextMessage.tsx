import { Interweave } from 'interweave';
import { FC } from 'react';

import style from './textMessage.module.scss';

interface Props {
  content: string;
  isDeleted: boolean;
}
const TextMessage: FC<Props> = ({ content, isDeleted = false }) => {
  return (
    <div className={style.textWrapper}>
      {isDeleted ? (
        <p className={style.deletedText}>Сообщение удалено...</p>
      ) : (
        <Interweave content={content} />
      )}
    </div>
  );
};

export default TextMessage;

import { FC } from 'react';

import { MessageListItem } from '../../../types/chat/messageListItem';

import style from './urlMessage.module.scss';

interface Props {
  message: MessageListItem;
}

const UrlMessage: FC<Props> = ({ message }) => {
  return (
    <div className={style.urlWrapper}>
      <a href={message.content}>{message.content}</a>
    </div>
  );
};

export default UrlMessage;

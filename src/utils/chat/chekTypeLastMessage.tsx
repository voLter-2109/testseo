/* eslint-disable @typescript-eslint/naming-convention */
import { Interweave } from 'interweave';

import { LastMessage } from '../../types/chat/chat';

import getFileType from './getFileType';

const checkTypeLastMessage = (message: LastMessage) => {
  const { content, files_list } = message;

  if (content.length > 0 && content !== '' && content !== '<p></p>') {
    let text = '';
    if (content.trim().length > 0) {
      text = content;
    } else {
      text = 'переотправленное сообщение';
    }
    const prevP = document.getElementById(`preview${message.id}`);
    prevP?.setAttribute('title', text.replace(/(<([^>]+)>)/gi, ''));
    return <Interweave content={text} />;
  }

  if (files_list && files_list.length) {
    const fileCount = files_list.length;
    const parts = [];
    const fileType = getFileType(files_list[0].file_type || '');

    if (fileType === 'image') {
      parts.push(`Изображения (${fileCount})`);
    } else if (fileType === 'audio') {
      parts.push(`Аудио (${fileCount})`);
    } else {
      parts.push(`Файлы (${fileCount})`);
    }

    if (parts.length > 0) {
      return <p>{parts.join(', ')}</p>;
    }
  }

  return <p>Нет сообщений</p>;
};

export default checkTypeLastMessage;

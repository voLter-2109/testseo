import { FC } from 'react';

import { FilesList } from '../../../types/chat/messageListItem';
import AudioMessageItem from '../audio-message-item/AudioMessageItem';
import TextMessage from '../text-message/TextMessage';

interface Props {
  fileList: FilesList[];
  content: string;
  isDeleted?: boolean;
}

const AudioMessage: FC<Props> = ({ content, fileList, isDeleted = false }) => {
  return (
    <>
      {fileList.map((item) => (
        <AudioMessageItem key={item.id} item={item} />
      ))}
      {content.length > 0 && (
        <TextMessage content={content} isDeleted={isDeleted} />
      )}
    </>
  );
};

export default AudioMessage;

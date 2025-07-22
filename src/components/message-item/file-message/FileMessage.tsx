import { FC } from 'react';

import { FilesList } from '../../../types/chat/messageListItem';
import FileMessageItem from '../file-message-item/FileMessageItem';
import TextMessage from '../text-message/TextMessage';

interface Props {
  fileList: FilesList[];
  content: string;
  isDeleted?: boolean;
}

const FileMessage: FC<Props> = ({ content, fileList, isDeleted = false }) => {
  return (
    <div
      style={{
        padding: '0px 8px',
      }}
    >
      {fileList.map((item) => (
        <FileMessageItem key={item.id} item={item} />
      ))}
      {content.length > 0 && (
        <TextMessage content={content} isDeleted={isDeleted} />
      )}
    </div>
  );
};

export default FileMessage;

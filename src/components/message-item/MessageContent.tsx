import { FC, memo } from 'react';

import {
  ALLOWED_IMAGE_TYPE_FORMAT,
  AUDIO_TYPE_FORMAT,
  FILE_TYPE_FORMAT,
} from '../../constant/infoTooltipMessages';
import { FilesList } from '../../types/chat/messageListItem';

import AudioMessage from './audio-message/AudioMessage';
import FileMessage from './file-message/FileMessage';
import ImageMessage from './image-message/ImageMessage';
import TextMessage from './text-message/TextMessage';

interface Props {
  fileList: FilesList[];
  content: string;
  isDeleted?: boolean;
}

const MessageContent: FC<Props> = ({
  fileList,
  content,
  isDeleted = false,
}) => {
  if (fileList.length > 0) {
    if (FILE_TYPE_FORMAT.includes(fileList[0].file_type || '')) {
      return <FileMessage fileList={fileList} content={content} />;
    }

    if (ALLOWED_IMAGE_TYPE_FORMAT.includes(fileList[0].file_type || '')) {
      return <ImageMessage fileList={fileList} content={content} />;
    }

    if (AUDIO_TYPE_FORMAT.includes(fileList[0].file_type || '')) {
      return <AudioMessage fileList={fileList} content={content} />;
    }
  }
  if (content.length > 0) {
    return <TextMessage content={content} isDeleted={isDeleted} />;
  }

  return null;
};

export default memo(MessageContent);

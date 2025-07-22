import {
  ALLOWED_IMAGE_TYPE_FORMAT,
  AUDIO_TYPE_FORMAT,
  FILE_TYPE_FORMAT,
} from '../../constant/infoTooltipMessages';
import { TypeOfMessage } from '../../types/chat/chat';

const getFileType = (file_type: string): TypeOfMessage => {
  if (ALLOWED_IMAGE_TYPE_FORMAT.includes(file_type)) {
    return 'image';
  }
  if (AUDIO_TYPE_FORMAT.includes(file_type)) {
    return 'audio';
  }
  if (FILE_TYPE_FORMAT.includes(file_type)) {
    return 'file';
  }
  return 'file';
};

export default getFileType;

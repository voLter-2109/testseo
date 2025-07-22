import { v4 as uuidv4 } from 'uuid';

import { AUDIO_TYPE_FORMAT } from '../../constant/infoTooltipMessages';
import {
  FilesList,
  ForwardMessage,
  MessageListItem,
  RepliedMessage,
} from '../../types/chat/messageListItem';
import { ForLoadingMessageList } from '../../types/websoket/websoket.types';

const createLoadingMessageList = ({
  uid,
  error,
  files,
  toUser,
  loading,
  forward,
  content,
  fromUser,
  request_uid,
  to_user_uid,
  repliedMEssage,
}: ForLoadingMessageList): MessageListItem => {
  const currentDate = Math.floor(Date.now() / 1000);
  const filesList: FilesList[] = [];

  files.forEach((file) => {
    let type = '';
    if (file.type === '') {
      const ext = file.name.split('.').at(-1) as string;
      type =
        AUDIO_TYPE_FORMAT.filter((item) => item.includes(ext))[0] ||
        'audio/mp3';
    } else {
      type = file.type;
    }
    const filesListItem: FilesList = {
      id: Math.floor(Math.random() * 1000000),
      uid: uuidv4(),
      file: file.name,
      file_url: URL.createObjectURL(file),
      file_type: type,
      file_webp: null,
      file_webp_url: null,
      new: true,
      created_at: currentDate,
      updated_at: currentDate,
    };
    filesList.push(filesListItem);
  });

  const forwardedMessages: ForwardMessage[] = forward.map((item) => {
    return {
      id: item.id,
      uid: uuidv4(),
      from_user: item.from_user.uid,
      from_user_role: item.from_user_role,
      content: item.content,
      files_list: item.files_list,
      new: true,
      created_at: item.created_at,
      updated_at: item.created_at,
      first_name: item.from_user.first_name,
      last_name: item.from_user.last_name,
    };
  });

  const repliedMessages: RepliedMessage[] = repliedMEssage.map((item) => {
    return {
      id: item.id,
      uid: item.uid,
      from_user: item.from_user.uid,
      from_user_role: item.from_user_role,
      content: item.content,
      files_list: item.files_list,
      new: item.new,
      created_at: item.created_at,
      updated_at: item.updated_at,
    };
  });

  return {
    content,
    created_at: currentDate,
    files_list: filesList,
    forwarded_messages: forwardedMessages,
    from_user: {
      avatar: '',
      avatar_url: '',
      avatar_webp: '',
      avatar_webp_url: '',
      first_name: fromUser.firstName,
      is_filled: true,
      last_name: fromUser.lastName,
      nickname: '',
      patronymic: '',
      uid,
      username: '',
    },
    from_user_role: 'patient',
    id: Math.floor(Math.random() * 1000000),
    new: true,
    replied_messages: repliedMessages,
    to_user: {
      avatar: '',
      avatar_url: '',
      avatar_webp: '',
      avatar_webp_url: '',
      first_name: toUser.firstName,
      is_filled: true,
      last_name: toUser.lastName,
      nickname: '',
      patronymic: '',
      uid: to_user_uid,
      username: '',
    },
    to_user_role: 'patient',
    uid: uuidv4(),
    updated_at: currentDate,

    request_uid,
    isLoading: loading,
    isError: error,
  };
};

export default createLoadingMessageList;

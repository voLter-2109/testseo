import { BaseListProps } from '../api/serverResponse';

// тип в списке сообщений from_user  и to_user
export interface FromToUser {
  uid: string;
  username: string;
  nickname: string;
  first_name: string;
  last_name: string;
  patronymic: string;
  avatar: string | null;
  avatar_url: string | null;

  avatar_webp: string | null;
  avatar_webp_url: string | null;
  is_filled: boolean;
}
// ___________________________________________
export interface FilesList {
  id: number;
  uid: string;
  file: string;
  file_url: string;
  file_type: string | null;
  file_webp: string | null;
  file_webp_url: string | null;
  new: boolean;
  created_at: number;
  updated_at: number;
}

// ___________________________________________
export interface ForwardMessage {
  id: number;
  uid: string;
  from_user: string;
  from_user_role: string;
  content: string;
  files_list: FilesList[];
  new: boolean;
  created_at: number;
  updated_at: number;
  first_name: string;
  last_name: string;
}

export interface RepliedMessage {
  id: number;
  uid: string;
  from_user: string;
  from_user_role: 'doctor' | 'patient';
  content: string;
  files_list: FilesList[];
  new: boolean;
  created_at: number;
  updated_at: number;
}

// тип отписывающий отдельно сообщение
export interface MessageListItem {
  id: number;
  uid: string;
  isDeleted?: boolean;

  from_user: FromToUser;
  from_user_role: 'doctor' | 'patient';

  to_user: FromToUser;
  to_user_role: 'doctor' | 'patient';

  content: string;

  replied_messages: RepliedMessage[];
  forwarded_messages: ForwardMessage[];

  files_list: FilesList[];
  new: boolean;
  created_at: number;
  updated_at: number;

  request_uid?: string;
  isLoading?: boolean;
  isError?: boolean;
  chat_id?: number;
}

// тип который возвращается по запросу на получение всех сообщений в чате
export interface MessagesList extends BaseListProps {
  results: MessageListItem[];
}

// ____________________________________________________________
// тип который возвращается по запросу на получение всех файловых сообщений в чате

export interface FileListItem {
  id: number;
  uid: string;

  from_user: FromToUser;
  from_user_role: 'doctor' | 'patient';

  to_user: FromToUser;
  to_user_role: 'doctor' | 'patient';
  message_id: number;
  file: string;
  file_url: string;
  file_type: string;
  file_webp: string | null;
  file_webp_url: string | null;
  size: number;
  new: boolean;
  created_at: number;
  updated_at: number;
}

export interface FilesListMessage extends BaseListProps {
  results: FileListItem;
}

import { BaseListProps } from '../api/serverResponse';
import { DoctorSpecialization } from '../doctor/doctor';
import { TChannels } from '../websoket/websoket.types';

// тип по запросу chat/list
export interface ChatsListItem {
  id: number;

  chat: Chat;

  is_active: boolean;
  is_favorite: boolean;
  index: number;

  message_count: number;
  file_count: number;
  new_message_count: number;
  new_file_count: number;

  last_message: LastMessage | null;

  last_seen_message: {
    id: number;
    uid: string;
  } | null;

  first_new_message: {
    id: number;
    uid: string;
  } | null;

  name: string;
  chat_type: TChannels;
  chat_key: string;
  description: string;
  created_by: string;
  owner_full_name: string;
  participants: {
    uid: string;
    full_name: string;
  }[];
}

export interface Chat {
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
  additional_information: string;
  birthday: number;
  is_filled: boolean;
  specialization: DoctorSpecialization[] | null | [];
  is_blocked: boolean;
  is_online: boolean;
  was_online_at: number;
}

export interface LastMessage {
  id: number;
  uid: string;
  from_user: string;
  from_user_role: 'doctor' | 'patient';
  content: string;
  files_list: FilesList[] | [];
  new: boolean;
  created_at: number;
  updated_at: number;
  request_uid?: string;
}

export interface FilesList {
  id: number;
  file: string;
  file_url: string;
  file_type: string | null;
  file_webp: string | null;
  file_webp_url: string | null;
  new: boolean;
  created_at: number;
  updated_at: number;
}

export interface ChatsList extends BaseListProps {
  results: ChatsListItem[];
}

// ___________________________________________________________

// Отправка - тип для rest запроса для отправки текстового сообщения
export interface CreatedTextMessage {
  content: string;
  forwarded_messages?: number[];
  replied_messages?: number[];
}
// Прием - тип для rest запроса для получения сообщений
export interface RequestTextMessage extends CreatedTextMessage {
  id: number;
  uid: string;
  replied_messages_uids: string[];
  forwarded_messages_uids: string[];
}

// ___________________________________________________________
// POST /chat/list/{id} - запрос для изменения свойств чата
export interface UpdatedChatProps {
  is_active?: boolean;
  is_favorite?: boolean;
  index?: number;
}

// ___________________________________________________________
// Отправка - POST /chat/message/file/{user_uid}/ Добавить файл в чат
export interface CreateFileMessage {
  fileBlob: File;
  message_id?: number;
  message_uid?: string;
}

// Прием - тип для rest запроса для получения сообщений
export interface RequestFileMessage {
  message_id?: number;
  id: number;
  uid: string;
  file: string;
  file_url: string;
  file_type: string;
  size: number;
}

// ___________________________________________
// Отправка  - изменить текстовое сообщение POST /chat/message/text/update/{id_or_uid}/
export interface UpdateTextMessage {
  id: number;
  uid?: string;
  content: string;
}

// Отправка удалить сообщение в чате DELETE /chat/message/text/delete/{id_or_uid}
export interface DeleteMessage {
  for_all: boolean;
  id: number;
  uid?: string;
}

export type TypeOfMessage = 'text' | 'file' | 'audio' | 'image';

// _______________________________________________
// Отправка - запрос позиции сообщения
export interface GetPositionMessage {
  field: string;
  query: string;
  chatPageSize: number;
}

export interface ReqGetPositionMessage {
  id: number;
  uid: string;
  page: number;
  position: number;
}

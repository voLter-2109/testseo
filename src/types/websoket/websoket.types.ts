import { FromToUser, MessageListItem } from '../chat/messageListItem';

export const CREATE_CHAT = 'create_chat';
export const CREATE_TEXT_MESSAGE = 'create_text_message';
export const NEW_STATUS_USER = 'new_status_user';
export const NEW_STATUS_USER_ALL = 'get_status_list_chat';
export const CHANGE_STATUS_READ_MESSAGE = 'change_status_read_message';
export const DELETE_MESSAGE = 'delete_message';
export const UPDATE_MESSAGE = 'update_message';

// _____________________________________________________________
// request к ответам от сокетов
export interface RequestObject {
  action: string;
  request_uid: string | null;
  status: 'OK' | 'error' | 'loading';
  error: string | undefined;
}

// ___________________________________________________________
// тип который надо отправить что бы удалить сообщение

export interface DeleteMessageWS {
  action: typeof DELETE_MESSAGE;
  request_uid: string;
  object: {
    id_or_uid: string;
    for_all: boolean;
  };
}

// тип ответа при удалении сообщения
export interface RequestDeleteMEssageWS extends RequestObject {
  message: {
    chat_id: number;
    id: string;
    uid: string;
    from_user: FromToUser;
    to_user: FromToUser;
  };
}

// ____________________________________________________________
// тип который надо отправить что бы изменить статус сообщения

export interface ChangeStatusMessage {
  action: typeof CHANGE_STATUS_READ_MESSAGE;
  object: {
    id_or_uid: string;
    new_read_status: boolean;
  };
  request_uid: string;
}

export interface UpdateMessage {
  action: typeof UPDATE_MESSAGE;
  object: {
    to_user_uid: string;
    id_or_uid: string;
    content: string;
    status: string;
    files?: FileForWS[];
  };
  request_uid: string;
}

// тип ответа по прочтению сообщений

export interface RequestChangeStatusMEssage extends RequestObject {
  object: MessageListItem;
}

export interface RequestUpdateMessage extends RequestObject {
  object: MessageListItem;
}

// _______________________________________________________________
// тип файла для сокетов
export interface FileForWS {
  data: string;
  filename: string;
}

// тип который описыват то что нужно отправить на бек по сокетам
export interface SendMessage {
  action: typeof CREATE_TEXT_MESSAGE;
  object: {
    to_user_uid: string;
    files: FileForWS[];
    content: string;
    status: string;
    replied_messages: number[];
    forwarded_messages: number[];
  };
  request_uid: string;
}

// props для функции отправки сообщения
export interface THandleSendMessage {
  type: TChannels;
  chatKey: string;
  toUserUid: string;
  content: {
    textContent: string;
    fileBlob: FileForWS[];
    filesForLoading: File[];
    forwardedMessages: MessageListItem[];
    repliedMEssage: MessageListItem[];
  };
  resetValue: (() => void) | null;
}

// ОТВЕТ - тип который приходит от сокетов внутри ключа message на текстовое сообщение
export interface MessageWithSocket extends RequestObject {
  object: MessageListItem;
}

// тип для использования в createLoadingMessageList
export interface ForLoadingMessageList {
  content: string;
  files: File[] | [];
  uid: string;
  to_user_uid: string;
  request_uid: string;
  loading: boolean;
  forward: MessageListItem[];
  error: boolean;
  toUser: {
    firstName: string;
    lastName: string;
  };
  fromUser: {
    firstName: string;
    lastName: string;
  };
  repliedMEssage: MessageListItem[];
}

// _______________________________________________________________
// тип который приходит от сокетов внутри ключа message на статус new_status_user
export interface NewCheckOnline {
  is_online: boolean;
  was_online_at: number;
  user: FromToUser;
}
// общий тип ответа от сокета по статусам
export interface RequestObjectOnlineStatus extends RequestObject {
  object: NewCheckOnline;
}

// _______________________________________________________________
// типы чатов
export enum TChannels {
  CHAT = 'chat',
  PUBLIC_GROUP = 'public-group',
  PRIVATE_GROUP = 'private-group',
  PUBLIC_CHANNEL = 'public-channel',
  PRIVATE_CHANNEL = 'private-channel',
}

export interface ObjectCreateChannel {
  name: string;
  chat_type: TChannels;
  description: string;
  avatar: {
    filename: string;
    data: string;
  } | null;
  uid_users_list: string[];
}

// тип который приходит от сокетов при ответе на метод "создание канала"
export interface CreateChannelResponse extends RequestObject {
  message: {
    chat_key: string;
    name: string;
    chat_type: TChannels;
    description: string;
    created_by: string;
    chat_avatar_url: string;
    participants: {
      uid: string;
      full_name: string;
    }[];
    owner_full_name: string;
  };
}

// тип который нужно отправить в сокет для создания чата
export interface CreateChannelPayload {
  action: typeof CREATE_CHAT;
  request_uid: string;
  object: ObjectCreateChannel;
}
// _________________________________________________________________
// тип useRef для записи ключей отправленных сообщений
export interface RequestCreateSendMessage {
  [key: string]: {
    sendMes: SendMessage | UpdateMessage;
    created_at: number;
    statusSend: boolean;
    filesForLoading: File[] | [];
  };
}

// _________________________________________________________________
// тип useRef для записи ключей удаленных сообщений
export interface RequestDeleteMessagesREf {
  [key: string]: {
    message: MessageListItem;
    request_uid: string;
  };
}

// тип useRef для записи ключей по  созданию групп и каналов
export interface RequestCreateChannelGroup {
  [key: string]: {
    message: ObjectCreateChannel;
    request_uid: string;
    createdUid: string;
  };
}

// _______________________________________________________________
// тип описывающий то что возвращает нос
export interface WebSocketProps {
  status: boolean;
  handleCreateTextMessage: ({
    toUserUid,
    content: { textContent, fileBlob },
    resetValue,
  }: THandleSendMessage) => void;
  handleCheckStatusOnlineUser: () => void;
  handleDeleteMessage: (message: MessageListItem) => void;
  handleChangeStatusReadMessage: (uid: string) => void;
  handleRepeatMessageSend: (requestUid: string) => void;
  handleEditMessage: (message: MessageListItem, content: string) => void;
  createChannel: (obj: ObjectCreateChannel, createdUid: string) => void;
}

import {
  SearchAndFilterChatParams,
  SearchAndFilterParams,
} from '../../types/api/search-filter-type';
import {
  ChatsList,
  CreatedTextMessage,
  CreateFileMessage,
  DeleteMessage,
  GetPositionMessage,
  ReqGetPositionMessage,
  RequestFileMessage,
  RequestTextMessage,
  UpdatedChatProps,
  UpdateTextMessage,
} from '../../types/chat/chat';
import {
  FilesListMessage,
  MessagesList,
} from '../../types/chat/messageListItem';
import { apiWithAuth } from '../api';

/**
 *
 * @name getChatsList
 * @description запрос на получение списка чатов
 * @prop {object} params?: example type SearchAndFilterChatParams
 * @returns {object} example type ChatList
 */
// ПРОВЕРЕНО
export const getChatsList = (params: SearchAndFilterChatParams) =>
  apiWithAuth.get<ChatsList>('/chat/list/', { params });

/**
 * @name changeChatInfo
 * @description изменение свойств чата
 * @prop {string} chatId
 * @prop {object} data: {index?: number, is_active?: boolean}
 * @returns {object} example type UpdatedChatParams
 */
// ПРОВЕРЕНО
export const changeChatInfo = (
  changeIdChat: number,
  { index, is_active, is_favorite }: UpdatedChatProps
) => {
  return apiWithAuth.post<UpdatedChatProps>(`/chat/list/${changeIdChat}/`, {
    index,
    is_active,
    is_favorite,
  });
};

/**
 * @name getTextMessagesList
 * @description получение списка текстовых сообщений
 * @prop {string} userId
 * @prop {object} params?: example type SearchAndFilterParamsWithTimeRange
 * @returns {object} example type MessagesList
 */
// ПРОВЕРЕНО
export const getTextMessagesList = (
  userId: string,
  params?: SearchAndFilterParams
) => apiWithAuth.get<MessagesList>(`/chat/message/text/${userId}/`, { params });

/**
 * @name createTextMessage
 * @description создание нового текстового сообщения
 * @prop {string} userId
 * @prop {object} data: example type CreatedTextMessage
 * @returns {object} example type RequestTextMessage
 */
// ПРОВЕРЕНО
export const createTextMessage = (
  userId: string,
  { content, forwarded_messages, replied_messages }: CreatedTextMessage
) =>
  apiWithAuth.post<RequestTextMessage>(`/chat/message/text/${userId}/`, {
    content,
    forwarded_messages,
    replied_messages,
  });

/**
 * @name updateTextMessage
 * @description обновление текстового сообщения
 * @prop {number} id
 * @prop {object} data: example type CreatedTextMessage
 * @returns {object} example type CreatedTextMessage
 */
// ПРОВЕРЕНО
export const updateTextMessage = ({
  id: updateIdMes,
  uid,
  content,
}: UpdateTextMessage) => {
  const mesId = uid || updateIdMes;

  return apiWithAuth.post<Required<UpdateTextMessage>>(
    `/chat/message/text/update/${mesId}/`,
    {
      content,
    }
  );
};

/**
 * @name markTextMessageAsRead
 * @description пометить текстовое сообщение как прочитанное
 * @returns {void}
 */
// ПРОВЕРЕНО
export const markTextMessageAsRead = (mesId: number | string) =>
  apiWithAuth.post<{ message: string }>(
    `/chat/message/text/mark_as_read/${mesId}/`
  );

/**
 * @name markTextMessageAsRead
 * @description очистить и удалить чат
 * @prop {number} id
 * @returns {void}
 */
// ПРОВЕРЕНО
export const deleteChatByUid = (id: number) =>
  apiWithAuth.delete(`/chat/list/${id}/`);

/**
 * @name markTextMessageAsRead
 * @description очистить чат
 * @prop {number} id
 * @returns {void}
 */
// ПРОВЕРЕНО
export const clearChatByUid = (id: number) =>
  apiWithAuth.post(`/chat/list/clear/${id}/`);

/**
 * @name markFileMessageAsRead
 * @description пометить сообщение с файлом как прочитанное
 * @prop {number} id
 * @returns {void}
 */
// ПРОВЕРЕНО
export const markFileMessageAsRead = (id: number) =>
  apiWithAuth.post<{ message: string }>(
    `/chat/message/file/mark_as_read/${id}/`
  );

/**
 * @name getFileMessagesList
 * @description получения списка файлов чата
 * @prop {string} userId
 * @prop {object} params?: example type SearchAndFilterParamsWithTimeRange
 * @returns {object} example type FilesList
 */
// ПРОВЕРЕНО
export const getFileMessagesList = (
  userId: string,
  params?: SearchAndFilterParams
) =>
  apiWithAuth.get<FilesListMessage>(`/chat/message/file/${userId}/`, {
    params,
  });

/**
 * @name createFileMessage
 * @description добавление нового сообщения с файлом
 * @prop {string} userId
 * @prop {object} data: example type FileMessageProps
 * @returns {object} example type CreatedFileMessage
 */
// ПРОВЕРЕНО
export const createFileMessage = (
  userId: string,
  { fileBlob, message_id, message_uid }: CreateFileMessage
) =>
  apiWithAuth.post<RequestFileMessage>(
    `/chat/message/file/${userId}/`,
    { file: fileBlob, message_id, message_uid },
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );

/**
 * @name deleteMessage
 * @description Удаление текстового и файлового сообщения
 * @prop {number} id
 * @returns {void}
 */
// ПРОВЕРЕНО
export const deleteMessage = ({ for_all, id, uid }: DeleteMessage) => {
  const chatId = uid || id;
  return apiWithAuth.delete(
    `/chat/message/text/delete/${chatId}/?for_all=${for_all}`
  );
};

/**
 * @name getMessagePosition
 * @description получение page и position сообщения
 * @prop {number} id
 * @returns {void}
 */
// ПРОВЕРЕНО
export const getPositionMessage = (
  uid: string,
  ordering: string,
  { field, query, chatPageSize }: GetPositionMessage
) => {
  return apiWithAuth.post<ReqGetPositionMessage[]>(
    `/chat/message/text/${uid}/search?ordering=${ordering}`,
    {
      field,
      query,
      chat_page_size: chatPageSize,
    }
  );
};

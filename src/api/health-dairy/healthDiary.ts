import { SearchAndFilterParams } from '../../types/api/search-filter-type';
import {
  HealthDiaryCommentsList,
  HealthDiaryCommentsListItem,
  HealthDiaryEntriesList,
  HealthDiaryEntriesListItem,
} from '../../types/health-dairy/healthDiary';
import { apiWithAuth } from '../api';

/**
 * @name getEntriesListByUserId
 * @description получение списка записей дневника здоровья
 * @prop {string} userId
 * @prop {object} params: example type SearchAndFilterParamsWithTimeRange
 * @returns {object} example type HealthDiaryEntriesList
 */

export const getEntriesListByUserId = (
  userId: string,
  params: SearchAndFilterParams
) =>
  apiWithAuth.get<HealthDiaryEntriesList>(`/health-diary/list/${userId}`, {
    params,
  });

/**
 * @name createEntry
 * @description создание записи в дневнике здоровья
 * @prop {string} content
 * @prop {'draft' | 'publish'} status статус записи, по умолчанию "публиковать"
 * @returns {object} example type HealthDiaryEntriesListItem
 */

export const createEntry = (
  content: string,
  status: 'draft' | 'publish' = 'publish'
) =>
  apiWithAuth.post<HealthDiaryEntriesListItem>('/health-diary/create/', {
    content,
    status,
  });

/**
 * @name editEntry
 * @description редактирование записи в дневнике здоровья
 * @prop {number} entryId
 * @prop {string} content обновленный текст записи
 * @prop {'draft' | 'publish'} status статус записи, по умолчанию "публиковать"
 * @returns {object} example type HealthDiaryEntriesListItem
 */

export const editEntry = (
  entryId: number,
  content: string,
  status: 'draft' | 'publish' = 'publish'
) =>
  apiWithAuth.patch<HealthDiaryEntriesListItem>(
    `/health-diary/update/${entryId}/`,
    {
      content,
      status,
    }
  );

/**
 * @name deleteEntry
 * @description удаление записи в дневнике здоровья
 * @prop {number} id: id записи
 * @returns {void}
 */

export const deleteEntry = (id: number) =>
  apiWithAuth.delete(`/health-diary/delete/${id}/`);

/**
 * @name getCommentsListById
 * @description получение списка комментариев для записи в дневнике здоровья
 * @prop {number} healthDiaryId
 * @prop {object} params: example type SearchAndFilterParamsWithTimeRange
 * @returns {object} example type HealthDiaryCommentsList
 */

export const getCommentsListById = (
  healthDiaryId: number,
  params: SearchAndFilterParams
) =>
  apiWithAuth.get<HealthDiaryCommentsList>(
    `/health-diary/comments/list/${healthDiaryId}`,
    {
      params,
    }
  );

export const createComment = (
  entryId: string,
  content: string,
  status: 'draft' | 'publish' = 'publish'
) =>
  apiWithAuth.post<HealthDiaryCommentsListItem>(
    `/health-diary/comments/create/${entryId}/`,
    {
      content,
      status,
    }
  );

/**
 * @name deleteComment
 * @description удаление комментария к записи в дневнике здоровья
 * @prop {number} id: id записи
 * @returns {void}
 */

export const deleteComment = (id: number) =>
  apiWithAuth.delete(`/health-diary/comments/delete/${id}/`);

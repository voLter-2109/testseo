import { FilterParams } from '../../types/api/search-filter-type';

import {
  ContactBlackList,
  ContactSuperShortUserInfo,
  ContactShortUserInfo,
} from '../../types/contact/contact';
import { apiWithAuth } from '../api';

/**
 * @name getContactUserByUid
 * @description запрос на получение данных юзера
 * @prop {string} uid: string
 * @returns {object} of ContactShortUserInfo type
 */

// ПРОВЕРЕНО
export const getContactUserByUid = ({ uid }: { uid: string }) =>
  apiWithAuth.get<ContactShortUserInfo>(`/contact/${uid}/`);

/**
 * @name getContactBlackList
 * @description запрос на получение черного списка юзеров
 * @prop {object} params?: example type FilterParams
 * @returns {object} of ContactBlackList type
 */

// ПРОВЕРЕНО
export const getContactBlackList = (params?: FilterParams) =>
  apiWithAuth.get<ContactBlackList>('/contact/blacklist/', { params });

/**
 * @name addToContactBlackList
 * @description добавление юзера в черный список
 * @prop {object} data: пока это пустой объект
 * @prop {string} uid: string
 * @returns {object} of ContactSuperShortUserInfo type
 */

// ПРОВЕРЕНО
export const addToContactBlackList = (data: object, uid: string) => {
  return apiWithAuth.post<ContactSuperShortUserInfo>(
    `/contact/blacklist/add/${uid}/`,
    data
  );
};

/**
 * @name deleteFromContactBlackList
 * @description удаление юзера из черного списка
 * @prop {string} uid: string
 * @returns {void}
 */

// ПРОВЕРЕНО
export const deleteFromContactBlackList = (uid: string) => {
  return apiWithAuth.delete(`/contact/blacklist/delete/${uid}/`);
};

/**
 * @name getContactRegisteredUsers
 * @description получение списка зарегистрированных юзеров
 * @prop {array[object]}: [{phone_or_nickname: string}] список номеров телефона или никнеймов
 * @returns {array} of ContactSuperShortUserInfo type
 */

// ПРОВЕРЕНО
export const getContactRegisteredUsers = (
  arr: { phone_or_nickname: string }[]
) => {
  return apiWithAuth.post<ContactSuperShortUserInfo[]>(
    '/contact/check/list/',
    arr
  );
};

export const testPerData = 0;

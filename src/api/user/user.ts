import { IUserProfile, UserAvatar, UserInfoSend } from '../../types/user/user';
import { apiWithAuth } from '../api';

/**
 * @name getСurrentUser
 * @description запрос на получение текущего юзера
 * @prop {object} data: при вызове метода не передаем ничего,
 * по умолчанию пустой объект вернет текущий профиль
 * @returns example type IUserProfile
 */

// ПРОВЕРЕНО
export const getСurrentUser = (data = {}) =>
  apiWithAuth.post<IUserProfile>('/auth/profile/', data);

/**
 * @name updateCurrentUser
 * @description обновление текущего профиля
 * @prop {object} data: example type UserInfoSend
 * @returns example type IUserProfile
 */
// ПРОВЕРЕНО
export const updateCurrentUser = (data: Partial<UserInfoSend>) =>
  apiWithAuth.post<IUserProfile>('/auth/profile/', data);

/**
 * @name checkUniqueNickname
 * @description проверка никнейма на уникальность
 * @prop {string} nickname: никнейм для проверки
 * @returns {object}: {messages: string}
 */
// ПРОВЕРЕНО
export const checkUniqueNickname = (nickname: string) =>
  apiWithAuth.get<{ messages: string }>( // TODO: возможно поменять на message, если изменят на бэке
    `/auth/profile/unique_nickname_check/${nickname}/`
  );

/**
 * @name addUserAvatar
 * @description изменение аватара
 * @prop {File} file: файл изображения
 * @returns {object}: example type UserAvatar
 */
// ПРОВЕРЕНО
export const addUserAvatar = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  return apiWithAuth.post<UserAvatar>(
    '/auth/profile/avatar/download/',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
};

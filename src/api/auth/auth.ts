import { apiClassic } from '../api';

import {
  TypeGetAuthToken,
  TypeGetConfirmationCode,
  TypeResponseAuthToken,
} from './auth.type';

/**
 * @name getConfirmationCode
 * @description запрос на получение кода на телефон
 * @prop {object} data:{phone_number: string}
 * @returns {object} {phone_number: string}
 */

export const getConfirmationCode = (data: TypeGetConfirmationCode) =>
  apiClassic.post<TypeGetConfirmationCode>('/auth/login/get/code/', data);

/**
 * @name getAuthToken
 *  @description запрос на получение токенов
 * @param {object} data:{'phone_number': string; code: number}
 * @returns {object} {refresh: string; access: string;}
 */

export const getAuthToken = (data: TypeGetAuthToken) =>
  apiClassic.post<TypeResponseAuthToken>('/auth/login/get/token/', data);

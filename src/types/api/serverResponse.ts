/**
 * @description вариант ответа от сервера, возможно если Аня изменит, придется переделать
 */

export interface ServerResponseError {
  message?: string;
  detail?: string;
  [field_name: string]: any;
}
/**
 * @description базовый вариант ответа от сервера для list
 */
export interface BaseListProps {
  count: number;
  next?: string | null;
  previous?: string | null;
}

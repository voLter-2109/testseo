import { BaseListProps } from '../api/serverResponse';

// тип описывающий краткую информацию о пользователе
export interface ContactShortUserInfo {
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
  is_doctor: boolean;
}

// тип описывающий очень краткую информацию о пользователе
export interface ContactSuperShortUserInfo {
  blocked_user: {
    uid: string;
    username: string;
    nickname: string;
    phone: string;
    first_name: string;
    last_name: string;
    patronymic: string;
    avatar: string | null;
    avatar_url: string | null;
    avatar_webp: string | null;
    avatar_webp_url: string | null;
    additional_information: string;
    birthday: number;
    chat_id: number;
  };
}

// тип описывающий получение черного списка юзеров
export interface ContactBlackList extends BaseListProps {
  results: Array<ContactSuperShortUserInfo>;
}

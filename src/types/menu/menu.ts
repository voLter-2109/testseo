import { ItemParams } from 'react-contexify';

export type ChatContextPayload = {
  id: number;
  isActiveChat: boolean;
  userId: string;
  lastName: string;
  firstName: string;
  patronymic: string;
  uid: string;
  isFavorite: string;
};

export enum ThemeEnum {
  DELL = 'dell',
  CLEAR = 'clear',
}

export type PropsDelClearFunc = {
  type: ThemeEnum | null;
  selMes: ItemParams<ChatContextPayload> | null;
};

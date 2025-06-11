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
  DELL = 'DELL',
  CLEAR = 'CLEAR',
  QUIT = 'QUIT',
}

export const YesOrNoMessages: Record<ThemeEnum, string> = {
  [ThemeEnum.DELL]: 'Вы действительно хотите удалить чат?',
  [ThemeEnum.CLEAR]: 'Вы действительно хотите очистить историю сообщений?',
  [ThemeEnum.QUIT]: 'Вы действительно хотите выйти из аккаунта?',
};

export type PropsYesOrNo = {
  type: ThemeEnum;
  selMes: ItemParams<ChatContextPayload> | null;
} | null;

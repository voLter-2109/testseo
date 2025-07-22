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
  CREATE_CHANNEL_EXIT = 'CREATE_CHANNEL_EXIT',
}

export const YesOrNoMessages: Record<ThemeEnum, string> = {
  [ThemeEnum.DELL]: 'Вы действительно хотите удалить чат?',
  [ThemeEnum.CLEAR]: 'Вы действительно хотите очистить историю сообщений?',
  [ThemeEnum.QUIT]: 'Вы действительно хотите выйти из аккаунта?',
  [ThemeEnum.CREATE_CHANNEL_EXIT]:
    'Вы уверены, что хотите выйти? Все данные будут потеряны.',
};

export type PropsYesOrNo = {
  type: ThemeEnum;
  selMes: ItemParams<ChatContextPayload> | null;
} | null;

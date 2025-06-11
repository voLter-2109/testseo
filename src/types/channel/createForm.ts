import { TChannels } from '../websoket/websoket.types';

export interface CreateChannelForm {
  name: string;
  typeChat: TChannels;
  privateChanel: boolean;
  desc: string;
  avatar: File[] | null;
  newAvatarUrl: string;
}

export enum NameCreateChannelForm {
  NAME = 'name',
  TYPE = 'type',
  DESC = 'desc',
  AVATAR = 'avatar',
  PRIVATECHANEL = 'privateChanel',
}

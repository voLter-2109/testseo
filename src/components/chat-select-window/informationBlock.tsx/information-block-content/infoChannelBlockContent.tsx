/* eslint-disable @typescript-eslint/naming-convention */

import { FC, useMemo } from 'react';

import Avatar from '../../../avatar/Avatar';

import useChatListStore from '../../../../store/chatListStore';
import ChannelType from '../../../chat-type/ChannelType';

import style from './infoChannelBlockContent.module.scss';
import CompanionChannelInfo from './CompanionChannelInfo';

interface Props {
  uid: string | null;
}

const InfoChannelBlockContent: FC<Props> = ({ uid }) => {
  const userList = useChatListStore((state) => state.userList);

  const companion = useMemo(
    () => (uid ? userList[uid] : null),
    [uid, userList]
  );

  const avatarUrl = companion?.avatar_webp_url || companion?.avatar_url;

  return (
    <div className={style.card}>
      <div className={style.headerWrapper}>
        <Avatar img={avatarUrl} />
        <h3>{companion?.name}</h3>
        <h4>
          <ChannelType uid={uid} />
        </h4>
      </div>
      <CompanionChannelInfo uid={uid} />
    </div>
  );
};

export default InfoChannelBlockContent;

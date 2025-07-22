import { FC, memo, useMemo } from 'react';

import useChatListStore from '../../store/chatListStore';
import { TChannels } from '../../types/websoket/websoket.types';

type Props = {
  uid: string | null;
};

const ChannelType: FC<Props> = ({ uid }) => {
  const userList = useChatListStore((state) => state.userList);

  const companion = useMemo(
    () => (uid ? userList[uid] : null),
    [uid, userList]
  );

  const channelType = useMemo(() => {
    if (companion?.chat_type === TChannels.PRIVATE_CHANNEL)
      return 'Приватный канал';
    if (companion?.chat_type === TChannels.PRIVATE_GROUP)
      return 'Приватная группа';
    if (companion?.chat_type === TChannels.PUBLIC_CHANNEL)
      return 'Публичный канал';
    if (companion?.chat_type === TChannels.PUBLIC_GROUP)
      return 'Публичная группа';
    return false;
  }, [companion?.chat_type]);

  return <>{channelType}</>;
};

export default memo(ChannelType);

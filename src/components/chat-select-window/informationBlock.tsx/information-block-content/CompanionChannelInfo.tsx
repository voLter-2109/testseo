import { FC, memo, useMemo } from 'react';

import useChatListStore from '../../../../store/chatListStore';

import style from './CompanionInfo.module.scss';

interface Props {
  uid: string | null;
}

const CompanionChannelInfo: FC<Props> = ({ uid }) => {
  const userList = useChatListStore((state) => state.userList);

  const companion = useMemo(
    () => (uid ? userList[uid] : null),
    [uid, userList]
  );

  const participantsCount = companion?.participants?.length ?? 0;

  return (
    <dl className={style.infoWrapper}>
      <dt className={style.infoHeader}>
        Описание
        {companion?.chat_type.endsWith('group') ? ' группы' : ' канала'}
      </dt>
      <dd className={style.infoText}>{companion?.description}</dd>
      <dd className={style.subs}>
        Подписчиков: <span className={style.subsNum}>{participantsCount}</span>
      </dd>
    </dl>
  );
};
export default memo(CompanionChannelInfo);

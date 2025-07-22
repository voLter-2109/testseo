/* eslint-disable @typescript-eslint/naming-convention */

import { useMemo } from 'react';

import Avatar from '../../components/avatar/Avatar';
import { Chat } from '../../types/chat/chat';

import useUserStore from '../../store/userStore';

import style from './reSendUserItem.module.scss';

interface Props extends Chat {}

const ReSendUserItem = (chat: Props) => {
  const user = useUserStore((state) => state.user);
  const {
    avatar_webp_url,
    avatar_url,
    specialization,
    last_name,
    first_name,
    patronymic,
    uid,
  } = chat;

  const haveSpecialization = useMemo(() => {
    if (specialization && specialization.length > 0 && specialization[0].name)
      return true;

    return false;
  }, []);

  return (
    <>
      <Avatar img={avatar_webp_url || avatar_url} size="small" />
      <div className={style.name}>
        <div>
          {user?.uid !== uid ? (
            <span>{`${last_name} ${first_name} ${patronymic}`}</span>
          ) : (
            <span>Избранное</span>
          )}
        </div>

        {specialization && haveSpecialization ? (
          <span className={style.specialization}>{specialization[0].name}</span>
        ) : null}
      </div>
    </>
  );
};

export default ReSendUserItem;

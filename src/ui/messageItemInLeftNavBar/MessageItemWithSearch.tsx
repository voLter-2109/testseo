/* eslint-disable @typescript-eslint/naming-convention */
import classNames from 'classnames';
import { Interweave } from 'interweave';
import { FC, memo } from 'react';
import { NavLink } from 'react-router-dom';

import useUserStore from '../../store/userStore';
import { MessageListItem } from '../../types/chat/messageListItem';

import Avatar from '../../components/avatar/Avatar';

import dateFormatter from '../../utils/chat/dateFormatter';

import style from './messageItemWithSearch.module.scss';

interface Props {
  m: MessageListItem;
}

const MessageItemWithSearch: FC<Props> = (props) => {
  const { user } = useUserStore((state) => state);
  const {
    m: { content, uid, created_at, from_user, to_user },
  } = props;

  const isSender = from_user.uid === user?.uid;
  const checkUserUid = isSender ? to_user : from_user;

  return (
    <div>
      <NavLink
        to={{
          pathname: checkUserUid.uid,
        }}
        state={{ searchUidMessage: uid }}
        className={({ isPending }) =>
          classNames(style.chatItem, {
            [style.isPending]: isPending,
          })
        }
      >
        <div className={style.wrapperAvatar}>
          <Avatar
            img={checkUserUid.avatar_webp_url || checkUserUid.avatar_url}
            size="medium"
            extraClassName={style.chatItemAvatar}
          />
        </div>
        <div className={style.content}>
          <h3 className={style.name} title={checkUserUid.first_name}>
            {`${checkUserUid.last_name} ${checkUserUid.first_name} ${checkUserUid.patronymic}`}
          </h3>

          <div className={style.message}>
            <Interweave content={content} />
            <div className={classNames(style.info)}>
              <div style={{ width: '46px', height: '24px' }} />

              <div className={style.date}>
                {content ? <>{dateFormatter(created_at)}</> : <span />}
              </div>
            </div>
          </div>
        </div>
      </NavLink>
    </div>
  );
};

export default memo(MessageItemWithSearch);

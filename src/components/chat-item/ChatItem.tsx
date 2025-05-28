import classNames from 'classnames';
import { FC, memo, useMemo, useRef } from 'react';
import { NavLink } from 'react-router-dom';

import { useContextMenu } from 'react-contexify';

import useWindowResize from '../../hooks/useWindowResize';
import useChatListStore from '../../store/chatListStore';
import useUserStore from '../../store/userStore';
import { ChatsListItem } from '../../types/chat/chat';
import checkTypeLastMessage from '../../utils/chat/chekTypeLastMessage';
import dateFormatter from '../../utils/chat/dateFormatter';

import { ReactComponent as Clip } from '../../assets/chat-list/clip.svg';
import Badge from '../../ui/badge/Badge';
import OnlineCheck from '../../ui/OnlineCheck/OnlineCheck';
import Avatar from '../avatar/Avatar';

import getTimeFromDate from '../../utils/chat/getTimeFromDate';

import style from './ChatItem.module.scss';

interface ChatsListItemProps extends ChatsListItem {
  isTableBarActive?: boolean;
}

const ChatItem: FC<ChatsListItemProps> = (props) => {
  const {
    chat,
    last_message: lastMessage,
    new_message_count: newMessageCount,
    is_active: isActiveChat,
    id,
    is_favorite: isFavorite,
    isTableBarActive,
  } = props;
  const {
    avatar_url: avatarUrl,
    avatar_webp_url: avatarWebpUrl,
    first_name: firstName,
    last_name: lastName,
    patronymic,
    uid,
    specialization,
  } = chat;

  const { isOnline, wasOnlineAt } = useChatListStore((state) =>
    state.getOnlineStateByUserUid(uid)
  );

  const chatItemRef = useRef<HTMLDivElement | null>(null);

  const titleOnline = useMemo(() => {
    if (isOnline) {
      return 'в сети';
    }
    if (!isOnline && wasOnlineAt) {
      return `был в сети ${getTimeFromDate(wasOnlineAt)}`;
    }

    return 'не в сети';
  }, [isOnline]);
  const { user } = useUserStore();

  const haveSpecialization = useMemo(() => {
    if (specialization && specialization.length > 0 && specialization[0].name)
      return true;

    return false;
  }, [chat]);

  const { table, mobileL } = useWindowResize();

  const { show } = useContextMenu({ id: 'chat-context-menu' });

  const blockChat = useChatListStore((state) => {
    if (uid) {
      const index = state.chatListStore.findIndex((item) => {
        return item.chat.uid === uid;
      });

      return index !== -1 && state.chatListStore[index].chat.is_blocked;
    }

    return true;
  });

  const displayMenu = (event: React.MouseEvent<HTMLElement>) => {
    show({
      id: 'chat-context-menu',
      event,
      props: {
        chat,
        isActiveChat,
        lastMessage,
        newMessageCount,
        isFavorite,
        id,
        uid,
        blockChat,
      },
    });
  };

  const extraTableBarClass = useMemo(() => {
    return isTableBarActive
      ? classNames(style.badgeTable, style.badgeTable_active)
      : style.badgeTable;
  }, [isTableBarActive]);

  return (
    <div ref={chatItemRef}>
      <NavLink
        to={uid}
        className={({ isActive, isPending }) =>
          classNames(style.chatItem, {
            [style.favorite]: isFavorite,
            [style.isActive]: isActive,
            [style.isPending]: isPending,
          })
        }
        onContextMenu={(event) => {
          displayMenu(event);
        }}
      >
        <div className={style.wrapperAvatar}>
          <Avatar
            img={avatarWebpUrl || avatarUrl}
            size="medium"
            extraClassName={style.chatItemAvatar}
          />
          <div title={titleOnline}>
            <OnlineCheck isOnline={isOnline} />
          </div>
        </div>
        <div className={style.content}>
          <h3 className={style.name} title={firstName}>
            {user?.uid !== uid
              ? lastName && firstName
                ? `${lastName} ${firstName} ${patronymic}`
                : 'Фамилия Имя Отчество'
              : 'Избранное (Вы)'}
          </h3>
          {haveSpecialization &&
            (chat.specialization === null ? (
              <h4 className={style.specialization}>Доктор</h4>
            ) : user?.uid !== uid ? (
              <h4 className={style.specialization}>
                {chat.specialization?.[0].name}
              </h4>
            ) : null)}
          {specialization?.length === 0 && (
            <h4 className={style.specialization}>Доктор</h4>
          )}

          <div id={`preview${lastMessage?.id}`} className={style.message}>
            {lastMessage && checkTypeLastMessage(lastMessage)}
          </div>
        </div>
        <div
          className={classNames(style.info, {
            [style.info_bottom]: !newMessageCount,
          })}
        >
          {newMessageCount > 0 ? (
            table && !mobileL ? (
              <Badge
                count={newMessageCount}
                type="new"
                extraClass={extraTableBarClass}
              />
            ) : (
              <Badge count={newMessageCount} type="new" />
            )
          ) : (
            <div style={{ width: '46px', height: '24px' }} />
          )}
          {isFavorite && <Clip className={style.clip} />}
          <div className={style.date}>
            {lastMessage ? (
              <>{dateFormatter(lastMessage?.created_at)}</>
            ) : (
              <span />
            )}
          </div>
        </div>
      </NavLink>
    </div>
  );
};

export default memo(ChatItem);

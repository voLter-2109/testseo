/* eslint-disable @typescript-eslint/naming-convention */

import classNames from 'classnames';
import { FC, memo, useMemo } from 'react';
import { NavLink } from 'react-router-dom';

import { useContextMenu } from 'react-contexify';

import tempChannelImg from '../../assets/side-menu/tempChannelImg.jpg';
import tempGroupImg from '../../assets/side-menu/tempGroupImg.png';

import useWindowResize from '../../hooks/useWindowResize';
import useChatListStore from '../../store/chatListStore';
import useUserStore from '../../store/userStore';
import { ChatsListItem } from '../../types/chat/chat';
import Badge from '../../ui/badge/Badge';
import OnlineCheck from '../../ui/OnlineCheck/OnlineCheck';
import Avatar from '../avatar/Avatar';

import checkTypeLastMessage from '../../utils/chat/chekTypeLastMessage';
import dateFormatter from '../../utils/chat/dateFormatter';
import getTimeFromDate from '../../utils/chat/getTimeFromDate';

import { ReactComponent as Clip } from '../../assets/chat-list/clip.svg';

import { TChannels } from '../../types/websoket/websoket.types';

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
    is_favorite: isFavorite,
    isTableBarActive,
    name,
    id,
    chat_type,
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

  const titleOnline = useMemo(() => {
    if (isOnline) return 'в сети';
    if (!isOnline && wasOnlineAt)
      return `был в сети ${getTimeFromDate(wasOnlineAt)}`;
    return 'не в сети';
  }, [isOnline, wasOnlineAt]);

  const { user } = useUserStore();

  const haveSpecialization = useMemo(() => {
    return (
      specialization && specialization.length > 0 && specialization[0].name
    );
  }, [specialization]);

  const { table, mobileL } = useWindowResize();

  const extraTableBarClass = useMemo(() => {
    return isTableBarActive
      ? classNames(style.badgeTable, style.badgeTable_active)
      : style.badgeTable;
  }, [isTableBarActive]);

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

  const checkMenuId = useMemo(() => {
    if (chat_type === TChannels.CHAT) return 'chat-context-menu';
    if (
      [TChannels.PRIVATE_CHANNEL, TChannels.PUBLIC_CHANNEL].includes(chat_type)
    )
      return 'channel-context-menu';
    if ([TChannels.PUBLIC_GROUP, TChannels.PRIVATE_GROUP].includes(chat_type))
      return 'group-context-menu';
    return undefined;
  }, [chat_type]);

  const displayMenu = (event: React.MouseEvent<HTMLElement>) => {
    show({
      id: checkMenuId,
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

  const getDefaultAvatar = () => {
    if (
      chat_type === TChannels.PUBLIC_GROUP ||
      chat_type === TChannels.PRIVATE_GROUP
    ) {
      return tempGroupImg;
    }
    if (
      chat_type === TChannels.PUBLIC_CHANNEL ||
      chat_type === TChannels.PRIVATE_CHANNEL
    ) {
      return tempChannelImg;
    }
    return undefined;
  };

  const getAvatar = () => {
    return avatarWebpUrl || avatarUrl || getDefaultAvatar();
  };

  const getTitle = () => {
    if (chat_type === TChannels.CHAT) {
      return user?.uid !== uid
        ? [firstName, lastName, patronymic].filter(Boolean).join(' ') ||
            'Фамилия Имя Отчество'
        : 'Избранное (Вы)';
    }
    return name || 'Без имени';
  };

  const getMessage = () => {
    return lastMessage && checkTypeLastMessage(lastMessage);
  };

  const getDate = () => {
    return lastMessage ? dateFormatter(lastMessage.created_at) : <span />;
  };

  const getBadge = () => {
    if (newMessageCount > 0) {
      if (table && !mobileL) {
        return (
          <Badge
            count={newMessageCount}
            type="new"
            extraClass={extraTableBarClass}
          />
        );
      }
      return <Badge count={newMessageCount} type="new" />;
    }
    return <div style={{ width: '46px', height: '24px' }} />;
  };

  const showOnline =
    chat_type === TChannels.CHAT || chat_type === TChannels.PRIVATE_GROUP;

  return (
    <div>
      <NavLink
        to={uid}
        onContextMenu={displayMenu}
        className={({ isActive, isPending }) =>
          classNames(style.chatItem, {
            [style.favorite]: isFavorite,
            [style.isActive]: isActive,
            [style.isPending]: isPending,
          })
        }
      >
        <div className={style.wrapperAvatar}>
          <Avatar
            img={getAvatar()}
            size="medium"
            extraClassName={style.chatItemAvatar}
          />
          {showOnline && (
            <div title={titleOnline}>
              <OnlineCheck isOnline={isOnline} />
            </div>
          )}
        </div>
        <div className={style.content}>
          <h3 className={style.name} title={getTitle()}>
            {getTitle()}
          </h3>
          {chat_type === TChannels.CHAT && haveSpecialization && (
            <h4 className={style.specialization}>
              {chat.specialization?.[0]?.name || 'Доктор'}
            </h4>
          )}
          <div id={`preview${lastMessage?.id}`} className={style.message}>
            {getMessage()}
          </div>
        </div>
        <div
          className={classNames(style.info, {
            [style.info_bottom]: !newMessageCount,
          })}
        >
          {getBadge()}
          {isFavorite && <Clip className={style.clip} />}
          <div className={style.date}>{getDate()}</div>
        </div>
      </NavLink>
    </div>
  );
};

export default memo(ChatItem);

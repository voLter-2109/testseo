/* eslint-disable react/prop-types */
import classNames from 'classnames';
import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router';

import { useQueryClient } from '@tanstack/react-query';
import { Item, ItemParams, Menu, useContextMenu } from 'react-contexify';

import { ReactComponent as Trash } from '../../../assets/bottom-bar/trash.svg';
import { ReactComponent as Archive } from '../../../assets/chat-list/archive.svg';
import { ReactComponent as Clip } from '../../../assets/chat-list/clip.svg';
import { ReactComponent as Cross } from '../../../assets/chat-list/cross-circle.svg';
import { ReactComponent as Mute } from '../../../assets/chat-list/mute.svg';

import Divider from '../../../ui/divider/Divider';

import useChatListStore from '../../../store/chatListStore';

import {
  changeChatInfo,
  clearChatByUid,
  deleteChatByUid,
} from '../../../api/chat/chat';

import { QKEY_GET_TEXT_MESSAGE } from '../../../constant/querykeyConstants';

import ToggleMenuItemBuilder from '../ToggleMenuItemBuilder/ToggleMenuItemBuilder';

import {
  ChatContextPayload,
  PropsYesOrNo,
  ThemeEnum,
} from '../../../types/menu/menu';

import YesOrNoModal from '../../popups/yes-or-no-popup/YesOrNoModal';

import style from './groupMenu.module.scss';

const GroupMenu = () => {
  const navigate = useNavigate();

  const [notificationsAreMuted, setNotificationsAreMuted] = useState(false);
  const [openModalClearOrDel, setOpenModalClearOrDel] =
    useState<PropsYesOrNo>(null);

  const queryClient = useQueryClient();

  const {
    setFavoriteChatById,
    setArchiveChatById,
    setDeleteChatById,
    resetChatAfterClear,
  } = useChatListStore();

  const resetCashMessageListByUid = useCallback(
    (chatUid: string) => {
      if (chatUid) {
        queryClient.removeQueries({
          queryKey: ['get last message', chatUid],
        });
        queryClient.removeQueries({
          queryKey: [QKEY_GET_TEXT_MESSAGE, { chatUid }],
        });

        queryClient.setQueryData([QKEY_GET_TEXT_MESSAGE, chatUid], () => {
          return {
            pages: [],
            pageParams: [],
          };
        });

        sessionStorage.removeItem(`virtualizer_measurementsCache_${chatUid}`);
        sessionStorage.removeItem(`virtualizer_scrollOffset_${chatUid}`);
      }
    },
    [queryClient]
  );

  const handleArchiveChatStatus = ({
    props,
  }: ItemParams<ChatContextPayload>) => {
    useContextMenu().hideAll();
    if (!props) return;
    const { id, isActiveChat } = props;
    try {
      changeChatInfo(id, { index: 0, is_active: !isActiveChat })
        .then(() => {
          setArchiveChatById({ uid: id });
        })
        .catch(() => console.log('error archive chat'));
      console.log('archive');
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteChat = ({ props }: ItemParams<ChatContextPayload>) => {
    useContextMenu().hideAll();
    if (!props) return;
    const { id, uid } = props;
    try {
      deleteChatByUid(id)
        .then(() => {
          setDeleteChatById({ uid: id });
          resetCashMessageListByUid(uid);

          navigate('../');
        })
        .catch((error) => {
          console.log(error);
          console.log('error delete chat');
        });
      console.log('delete');
    } catch (error) {
      console.log(error);
    }
  };

  const handleClearChat = ({ props }: ItemParams<ChatContextPayload>) => {
    useContextMenu().hideAll();
    if (!props) return;
    const { id, uid } = props;
    try {
      clearChatByUid(id).then(() => {
        resetChatAfterClear(id);
        resetCashMessageListByUid(uid);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleFavoriteChat = ({ props }: ItemParams<ChatContextPayload>) => {
    useContextMenu().hideAll();
    if (!props) return;
    const { id, isFavorite } = props;
    try {
      changeChatInfo(id, { is_favorite: !isFavorite })
        .then(() => {
          setFavoriteChatById({ uid: id });
        })
        .catch((error) => {
          console.log(error);
          console.log('error delete chat');
        });
    } catch (e) {
      console.log(e);
    }
  };

  const handleNotificationClick = () => {
    useContextMenu().hideAll();
    setNotificationsAreMuted((state) => !state);
  };

  const handleCloseModalClearOrDel = () => {
    setOpenModalClearOrDel(null);
  };

  const handleOpenModalClearOrDel = (e: PropsYesOrNo) => {
    useContextMenu().hideAll();
    setOpenModalClearOrDel(e);
  };

  const handleFunc = (e: PropsYesOrNo) => {
    if (e && e.type === ThemeEnum.DELL && e.selMes) {
      handleDeleteChat(e.selMes);
    }

    if (e && e.type === ThemeEnum.CLEAR && e.selMes) {
      handleClearChat(e.selMes);
    }
  };

  return (
    <>
      <Menu
        id="group-context-menu"
        animation={false}
        className={style.menuWrapper}
      >
        {ToggleMenuItemBuilder(
          style.menuButton,
          style.menuContent,
          'isActiveChat',
          <Archive className={style.icon} />,
          ['Архивировать группу', 'Разархивировать группу'],
          handleArchiveChatStatus
        )}
        <Item
          className={style.menuButton}
          disabled
          onClick={handleNotificationClick}
        >
          <div className={style.menuContent}>
            <Mute className={style.icon} />
            <span>
              {notificationsAreMuted ? 'Включить звук' : 'Выключить звук'}
            </span>
          </div>
        </Item>
        {ToggleMenuItemBuilder(
          style.menuButton,
          style.menuContent,
          'isFavorite',
          <Clip className={style.icon} />,
          [' Открепить группу', 'Закрепить группу'],
          handleFavoriteChat
        )}

        <Divider />
        <Item
          className={style.menuButton}
          onClick={(e) => {
            handleOpenModalClearOrDel({ type: ThemeEnum.CLEAR, selMes: e });
          }}
        >
          <div className={classNames(style.menuContent, style.redC)}>
            <Cross className={style.trash} />
            <span>Очистить историю</span>
          </div>
        </Item>
        <Item
          className={style.menuButton}
          onClick={(e) => {
            handleOpenModalClearOrDel({ type: ThemeEnum.DELL, selMes: e });
          }}
        >
          <div className={classNames(style.menuContent, style.redC)}>
            <Trash className={style.trash} />
            <span>Удалить чат</span>
          </div>
        </Item>
      </Menu>

      {openModalClearOrDel && (
        <YesOrNoModal
          handleFunc={handleFunc}
          onClose={handleCloseModalClearOrDel}
          isOpen={openModalClearOrDel}
        />
      )}
    </>
  );
};

export default React.memo(GroupMenu);

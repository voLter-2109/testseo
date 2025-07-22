/* eslint-disable react/prop-types */
import classNames from 'classnames';
import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router';

import { useQueryClient } from '@tanstack/react-query';
import { Item, ItemParams, Menu, useContextMenu } from 'react-contexify';

import { ReactComponent as Trash } from '../../../assets/bottom-bar/trash.svg';
import { ReactComponent as BlackListAdd } from '../../../assets/chat-list/add_to_blacklist.svg';
import { ReactComponent as Archive } from '../../../assets/chat-list/archive.svg';
import { ReactComponent as Clip } from '../../../assets/chat-list/clip.svg';
import { ReactComponent as Cross } from '../../../assets/chat-list/cross-circle.svg';
import { ReactComponent as Mute } from '../../../assets/chat-list/mute.svg';
import BlacklistPopup from '../../popups/blacklist-popup/BlacklistPopup';
import BlacklistWarnPopup from '../../popups/blacklist-warn-popup/BlacklistWarnPopup';

import Divider from '../../../ui/divider/Divider';

import useChatListStore from '../../../store/chatListStore';

import {
  changeChatInfo,
  clearChatByUid,
  deleteChatByUid,
} from '../../../api/chat/chat';

import { addToContactBlackList } from '../../../api/contact/contact';

import useNotifyToast from '../../../hooks/useNotifyToast';

import { QKEY_GET_TEXT_MESSAGE } from '../../../constant/querykeyConstants';

import ToggleMenuItemBuilder from '../ToggleMenuItemBuilder/ToggleMenuItemBuilder';

import ToggleBlockMenuItemBuilder from '../ToggleBlockMenuItemBuilder/ToggleBlockMenuItemBuilder';

import {
  ChatContextPayload,
  PropsYesOrNo,
  ThemeEnum,
} from '../../../types/menu/menu';

import YesOrNoModal from '../../popups/yes-or-no-popup/YesOrNoModal';

import style from './chatMenu.module.scss';

const ChatMenu = () => {
  const navigate = useNavigate();

  const [notificationsAreMuted, setNotificationsAreMuted] = useState(false);
  const [openModalBL, setOpenModalBL] = useState(false);
  const [openModalClearOrDel, setOpenModalClearOrDel] =
    useState<PropsYesOrNo>(null);
  const [openBLWarnModal, setOpenBLWarnModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{
    uid: string;
    firstName: string;
    secondName: string;
    patronymic: string;
  } | null>(null);

  const queryClient = useQueryClient();

  const {
    setFavoriteChatById,
    setBlockedChatById,
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

  const handleAddUserToBL = async ({
    props,
  }: ItemParams<ChatContextPayload>) => {
    useContextMenu().hideAll();
    if (!props) return;

    const { uid: userId } = props;

    try {
      await addToContactBlackList({}, userId);
      setBlockedChatById(userId);
      useNotifyToast({
        text: `пользователь ${selectedUser?.secondName} ${selectedUser?.firstName} ${selectedUser?.patronymic} добавлен в черный список`,
        type: 'success',
      });
    } catch (error) {
      useNotifyToast({
        text: 'Ошибка при добавлении',
        type: 'error',
      });
      console.log(error);
    }
  };

  const handleAddUserToBLByUid = async (uid: string) => {
    await handleAddUserToBL({
      props: { uid },
    } as ItemParams<ChatContextPayload>);
  };

  const toggleViewBLWarnPopUp = () => {
    setOpenBLWarnModal((prev) => !prev);
  };

  const toggleViewBlacklistPopUp = () => {
    setOpenModalBL((prev) => !prev);
  };

  const handleBlock = ({ props }: ItemParams<any>) => {
    useContextMenu().hideAll();
    if (!props) return;
    const { blockChat } = props;
    if (!blockChat) toggleViewBLWarnPopUp();
    else toggleViewBlacklistPopUp();
    setSelectedUser({
      uid: props.uid,
      firstName: props.first_name,
      secondName: props.second_name,
      patronymic: props.patronymic,
    });
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
        id="chat-context-menu"
        animation={false}
        className={style.menuWrapper}
      >
        {ToggleMenuItemBuilder(
          style.menuButton,
          style.menuContent,
          'isActiveChat',
          <Archive className={style.icon} />,
          ['Архивировать чат', 'Разархивировать чат'],
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
          [' Открепить чат', 'Закрепить чат'],
          handleFavoriteChat
        )}
        {ToggleBlockMenuItemBuilder(
          style.menuButton,
          style.menuContent,
          <BlackListAdd className={style.icon} />,
          ['Добавить в черный список', 'Удалить из черного списка'],
          handleBlock
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
      {openModalBL && (
        <BlacklistPopup
          onClose={toggleViewBlacklistPopUp}
          isOpen={openModalBL}
        />
      )}

      {openModalClearOrDel && (
        <YesOrNoModal
          handleFunc={handleFunc}
          onClose={handleCloseModalClearOrDel}
          isOpen={openModalClearOrDel}
        />
      )}
      {openBLWarnModal && (
        <BlacklistWarnPopup
          onClose={toggleViewBLWarnPopUp}
          isOpen={openBLWarnModal}
          confirmAddToBL={(block: boolean) => {
            if (block && selectedUser?.uid) {
              handleAddUserToBLByUid(selectedUser.uid);
            }
          }}
        />
      )}
    </>
  );
};

export default React.memo(ChatMenu);

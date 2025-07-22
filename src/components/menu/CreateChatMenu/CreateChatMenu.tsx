import classNames from 'classnames';
import { useState } from 'react';
import { Item, Menu, useContextMenu } from 'react-contexify';

import { ADD_CONTEXT_MENU_ID } from '../../../constant/other-constants';

import CreateChannelPopup from '../../popups/create-channel-popup/CreateChannelPopup';

import { TChannels } from '../../../types/websoket/websoket.types';

import style from './createChatMenu.module.scss';

type ModalProps = TChannels.PUBLIC_GROUP | TChannels.PUBLIC_CHANNEL | null;

const CreateChatMenu = () => {
  const [openCreateChannelGroupModal, setOpenCreateChannelGroupModal] =
    useState<ModalProps>(null);

  // тогл для модального окна создания группы
  const toggleViewCreateGroupPopUp = () => {
    useContextMenu().hideAll();
    setOpenCreateChannelGroupModal(TChannels.PUBLIC_GROUP);
  };

  const toggleViewCreateChannelPopUp = () => {
    useContextMenu().hideAll();
    setOpenCreateChannelGroupModal(TChannels.PUBLIC_CHANNEL);
  };

  const closeModal = () => {
    setOpenCreateChannelGroupModal(null);
  };

  const createNewFolder = () => {
    useContextMenu().hideAll();
  };

  return (
    <>
      <Menu
        id={ADD_CONTEXT_MENU_ID}
        className={classNames(style.contextMenu)}
        animation={false}
      >
        <Item onClick={toggleViewCreateGroupPopUp}>
          <span>Создать группу</span>
        </Item>
        <Item onClick={toggleViewCreateChannelPopUp}>
          <span>Создать канал</span>
        </Item>
        <Item onClick={createNewFolder}>
          <span>Создать папку</span>
        </Item>
      </Menu>

      {openCreateChannelGroupModal && (
        <CreateChannelPopup
          type={openCreateChannelGroupModal}
          onClose={closeModal}
          isOpen={Boolean(openCreateChannelGroupModal)}
        />
      )}
    </>
  );
};

export default CreateChatMenu;

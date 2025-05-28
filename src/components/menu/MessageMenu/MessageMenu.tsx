/* eslint-disable react/prop-types */
import React, { useContext, useRef, useState } from 'react';
import { Item, Menu, useContextMenu } from 'react-contexify';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import classNames from 'classnames';

import { ReactComponent as Trash } from '../../../assets/bottom-bar/trash.svg';
import { ReactComponent as Arrow } from '../../../assets/message/arrow.min.svg';
import { ReactComponent as Change } from '../../../assets/message/change.svg';
import { ReactComponent as CopySuccess } from '../../../assets/message/check_green.svg';
import { ReactComponent as Copy } from '../../../assets/message/copy.min.svg';
import { ReactComponent as Select } from '../../../assets/message/select.min.svg';
import { ReactComponent as Cross } from '../../../assets/side-menu/cross_black.svg';
import Divider from '../../../ui/divider/Divider';

import DeleteMessagePopup from '../../popups/delete-message-popup/DeleteMessagePopup';

import { MessageListItem } from '../../../types/chat/messageListItem';

import { WebSocketContext } from '../../../providers/Websoket';

import style from './messageMenu.module.scss';

const MessageMenu = () => {
  const messageMenuRef = useRef<HTMLDivElement>(null);
  const [isDeleteMessagePopupOpen, setIsDeleteMessagePopupOpen] =
    useState(false);
  const [chosenMessage, setChosenMessage] = useState<MessageListItem | null>(
    null
  );

  const contextSocket = useContext(WebSocketContext);
  const { hideAll } = useContextMenu();
  const { handleDeleteMessage } = contextSocket ?? {};

  const divRef = useRef<HTMLDivElement>(null);

  const [statusCopyText, setStatusCopyText] = useState<'def' | 'suc' | 'er'>(
    'def'
  );

  const handleCopyText = (status: 'suc' | 'er') => {
    setStatusCopyText(status);
    setTimeout(() => {
      setStatusCopyText('def');
    }, 800);
  };

  const copyPlainTextFromHTML = async (html: string) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    const text = div.textContent || '';
    return navigator.clipboard.writeText(text);
  };

  const isBlocked = (props: { blockChat: boolean }) => props.blockChat;

  return (
    <div ref={messageMenuRef}>
      <Menu
        id="message-context-menu"
        animation={false}
        className={style.menuWrapper}
      >
        <Item
          disabled={({ props }) => isBlocked(props)}
          className={style.menuButton}
          onClick={({ props }) => {
            const { item, setRepliedMessageOnVirtualize } = props;
            setRepliedMessageOnVirtualize(item);
            hideAll();
          }}
        >
          <div className={style.menuContent}>
            <Arrow className={style.arrow} />
            <span>Ответить</span>
          </div>
        </Item>
        <Divider />

        <Item
          className={style.menuButton}
          onClick={({ props }) => {
            const { item } = props;
            copyPlainTextFromHTML(item.content)
              .then(() => handleCopyText('suc'))
              .catch(() => handleCopyText('er'));
          }}
          disabled={({ props }) => isBlocked(props)}
        >
          <div className={style.menuContent} ref={divRef}>
            <SwitchTransition mode="out-in">
              <CSSTransition
                nodeRef={divRef}
                addEndListener={(done: () => void) => {
                  divRef.current?.addEventListener(
                    'transitionend',
                    done,
                    false
                  );

                  setTimeout(() => {
                    hideAll();
                  }, 500);
                }}
                classNames="fade-fast"
                key={statusCopyText === 'def' ? 'def' : 'any'}
              >
                <div ref={divRef} style={{ height: '2rem' }}>
                  {statusCopyText === 'def' && <Copy className={style.icon} />}
                  {statusCopyText === 'suc' && (
                    <CopySuccess className={style.icon} />
                  )}
                  {statusCopyText === 'er' && <Cross className={style.icon} />}
                </div>
              </CSSTransition>
            </SwitchTransition>

            <span>Копировать текст</span>
          </div>
        </Item>

        <Item
          className={style.menuButton}
          onClick={({ props }) => {
            const { item, toggleSelectMessage } = props;
            toggleSelectMessage(item);
            hideAll();
          }}
          disabled={({ props }) => isBlocked(props)}
        >
          <div className={style.menuContent}>
            <Select className={style.icon} />
            <span>Выбрать</span>
          </div>
        </Item>

        <Item
          className={style.menuButton}
          hidden={({ props }) => {
            const { message, userUid } = props;
            const {
              from_user: { uid: fromUserUid },
            } = message;

            return userUid !== fromUserUid;
          }}
          disabled={({ props }) => isBlocked(props)}
          onClick={({ props }) => {
            const { item, setEditingMessage } = props;
            setEditingMessage(item);
            hideAll();
          }}
        >
          <div className={style.menuContent}>
            <Change className={style.icon} />
            <span>Изменить</span>
          </div>
        </Item>

        <Item
          className={style.menuButton}
          onClick={({ props }) => {
            const { item, handleChangeSelectMessage } = props;
            handleChangeSelectMessage(item);
            hideAll();
          }}
          disabled={({ props }) => isBlocked(props)}
        >
          <div className={style.menuContent}>
            <Arrow className={classNames(style.arrow, style.arrowLeft)} />
            <span>Переслать</span>
          </div>
        </Item>
        <Divider />
        <Item
          className={style.menuButton}
          onClick={({ props }) => {
            const { item } = props;
            setChosenMessage(item);
            setIsDeleteMessagePopupOpen(true);
            hideAll();
          }}
          disabled={({ props }) => isBlocked(props)}
        >
          <div className={style.menuContent}>
            <Trash className={style.icon} />
            <span style={{ color: 'var(--red-primary)' }}>Удалить</span>
          </div>
        </Item>
      </Menu>

      {isDeleteMessagePopupOpen && (
        <DeleteMessagePopup
          isOpen={isDeleteMessagePopupOpen}
          onClose={() => setIsDeleteMessagePopupOpen(false)}
          handleMessageDelete={() => {
            if (handleDeleteMessage && chosenMessage) {
              handleDeleteMessage(chosenMessage);
            }
          }}
        />
      )}
    </div>
  );
};

export default React.memo(MessageMenu);

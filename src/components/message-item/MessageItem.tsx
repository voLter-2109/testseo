import classNames from 'classnames';
import { FC, useCallback, useContext, useEffect } from 'react';
import { useContextMenu } from 'react-contexify';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';

import { ReactComponent as Warning } from '../../assets/message/warning-icon.svg';

import { WebSocketContext } from '../../providers/Websoket';
import { MessageListItem } from '../../types/chat/messageListItem';

import { ReactComponent as SendUnreadedSvg } from '../../assets/message/check_green.svg';
import { ReactComponent as SendReadedSvg } from '../../assets/message/double_check_green.svg';

import CustomButton from '../../ui/custom-button/Button';
import Clock from '../../ui/spinner/Clock';

import useChatListStore from '../../store/chatListStore';

import CheckBoxMessage from '../../ui/checkBoxMessage/CheckBoxMessage';

import MessageContent from './MessageContent';

import style from './MessageItem.module.scss';

interface MessageItemProps {
  time: string;
  isSelect: boolean;
  blockChat: boolean;
  selectMode: boolean;
  type: 'send' | 'get';
  userUid: string | null;
  viewRepliedMes: boolean;
  message: MessageListItem;
  setRepliedMessageOnVirtualize: (m: MessageListItem) => void;
  toggleSelectMessage: (fMes: MessageListItem) => void;
  handleChangeSelectMessage: (m: MessageListItem) => void;
  setEditingMessage: (item: MessageListItem | null) => void;
  handleScrollRepliedMessage: ({
    messageRepliedUid,
  }: {
    messageRepliedUid: string;
  }) => void;
}

const MessageItem: FC<MessageItemProps> = ({
  type,
  time,
  userUid,
  message,
  isSelect,
  blockChat,
  selectMode,
  viewRepliedMes,
  setEditingMessage,
  setRepliedMessageOnVirtualize,
  handleChangeSelectMessage,
  handleScrollRepliedMessage,
  toggleSelectMessage,
}) => {
  const { show } = useContextMenu({ id: 'message-context-menu' });
  const contextSocket = useContext(WebSocketContext);
  const { handleRepeatMessageSend, handleChangeStatusReadMessage } =
    contextSocket ?? {};

  const changeLastSeMessage = useChatListStore(
    (state) => state.changeLastSeMessage
  );

  const handleMessageClick = () => {
    if (selectMode) {
      toggleSelectMessage(message);
    }
  };

  const { ref: refStatusMessage, inView: inViewMessage } = useInView({
    threshold: 0.5,
    delay: 300,
  });

  const handleSelectRepliedMes = useCallback(
    (item: MessageListItem) => setRepliedMessageOnVirtualize(item),
    [setRepliedMessageOnVirtualize]
  );

  const handleMenuChangeSelection = useCallback(
    (item: MessageListItem) => handleChangeSelectMessage(item),
    [handleChangeSelectMessage]
  );

  const handleEditingMessage = useCallback(
    (item: MessageListItem) => {
      setEditingMessage(item);
    },
    [setEditingMessage]
  );

  const displayMenu = (
    event: React.MouseEvent<HTMLDivElement>,
    item: MessageListItem
  ) => {
    show({
      id: 'message-context-menu',
      event,
      props: {
        type,
        time,
        userUid,
        message,
        isSelect,
        blockChat,
        selectMode,
        setRepliedMessageOnVirtualize: handleSelectRepliedMes,
        handleChangeSelectMessage: handleMenuChangeSelection,
        setEditingMessage: handleEditingMessage,
        toggleSelectMessage,
        item,
      },
    });
  };

  useEffect(() => {
    if (
      inViewMessage &&
      handleChangeStatusReadMessage &&
      type === 'get' &&
      message.new
    ) {
      handleChangeStatusReadMessage(message.uid);
    }
  }, [type, message.new, inViewMessage, handleChangeStatusReadMessage]);

  useEffect(() => {
    if (
      inViewMessage &&
      handleChangeStatusReadMessage &&
      message.from_user.uid === userUid &&
      message.to_user.uid === userUid &&
      message.new &&
      !message.isError &&
      !message.isLoading
    ) {
      handleChangeStatusReadMessage(message.uid);
    }
  }, [
    userUid,
    message.new,
    message.isLoading,
    message.isError,
    inViewMessage,
    handleChangeStatusReadMessage,
  ]);

  useEffect(() => {
    const checkUserUid =
      message.from_user.uid === userUid
        ? message.to_user.uid
        : message.from_user.uid;

    if (inViewMessage) {
      changeLastSeMessage(checkUserUid, {
        idMes: message.id,
        uidMes: message.uid,
      });
    }
  }, [inViewMessage, message]);

  return (
    <div ref={refStatusMessage} id={message.uid}>
      <div
        className={classNames('message_wrapper', style.message_wrapper, {
          [style.scrollTo]: viewRepliedMes,
        })}
        onContextMenu={(e) => {
          const hasMessageWrapper = Boolean(
            // @ts-ignore
            e.target.closest('.message_wrapper')
          );
          // @ts-ignore
          if (e.target.nodeName === 'IMG') {
            return undefined;
          }

          // @ts-ignore
          if (!selectMode && hasMessageWrapper) {
            return displayMenu(e, message);
          }

          return undefined;
        }}
        onClick={handleMessageClick}
      >
        <CheckBoxMessage
          onChange={handleMessageClick}
          checked={isSelect}
          selectMode={selectMode}
        />
        <div
          className={`${style.message} ${
            type === 'send' ? style.message_send : style.message_get
          }`}
          onClick={handleMessageClick}
        >
          <div className={style.content}>
            {message.replied_messages.length > 0 &&
              message.replied_messages.map((item) => {
                const fromU =
                  message.from_user.uid === item.from_user
                    ? `${message.from_user.first_name} ${message.from_user.last_name}`
                    : `${message.to_user.first_name} ${message.to_user.last_name}`;
                return (
                  <button
                    type="button"
                    onClick={() => {
                      console.log('tyt');
                      handleScrollRepliedMessage({
                        messageRepliedUid: item.uid,
                      });
                    }}
                    className={style.forwarded_message}
                    key={`forwardItem_${item.uid}`}
                  >
                    <div>
                      <div>
                        <span
                          style={{
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            opacity: '0.8',
                            color: 'black',
                          }}
                        >{`Ответ на: ${fromU}`}</span>
                        <MessageContent
                          content={item.content}
                          fileList={item.files_list}
                        />
                      </div>
                    </div>
                  </button>
                );
              })}
            {message.forwarded_messages.length > 0 &&
              message.forwarded_messages.map((item) => {
                return (
                  <div
                    key={`forwardItem_${item.uid}`}
                    className={style.forwarded_message}
                  >
                    <div>
                      <Link
                        to={`/${item.from_user}`}
                        style={{
                          fontSize: '0.9rem',
                          opacity: '0.9',
                          cursor: 'pointer',
                        }}
                      >{`Переслано от: ${item.first_name} ${item.last_name}`}</Link>
                      <MessageContent
                        content={item.content}
                        fileList={item.files_list}
                      />
                    </div>
                  </div>
                );
              })}
            <MessageContent
              isDeleted={message.isDeleted}
              content={message.content}
              fileList={message.files_list}
            />
          </div>
          <div className={style.info}>
            {!message.isError ? (
              <>
                <div className={style.time}>{time}</div>
                {message.isLoading ? (
                  <Clock />
                ) : message.new ? (
                  <SendUnreadedSvg />
                ) : (
                  <SendReadedSvg />
                )}
              </>
            ) : (
              <CustomButton
                styleBtn="red"
                title="Не удалось отправить, нажмите что бы попробовать заново"
                classNameBtn={style.error}
                onClick={() =>
                  handleRepeatMessageSend &&
                  message.request_uid &&
                  handleRepeatMessageSend(message.request_uid)
                }
              >
                <Warning width={16} height={16} />
              </CustomButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageItem;

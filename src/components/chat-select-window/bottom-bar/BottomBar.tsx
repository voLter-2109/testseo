/* eslint-disable jsx-a11y/control-has-associated-label */

import classNames from 'classnames';
import {
  FC,
  FormEvent,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Item, Menu, useContextMenu } from 'react-contexify';
import toast from 'react-hot-toast';
import ReactQuill from 'react-quill';
import { CSSTransition, SwitchTransition } from 'react-transition-group';

import { ReactComponent as AttachSvg } from '../../../assets/bottom-bar/attach.svg';
import { ReactComponent as Music } from '../../../assets/bottom-bar/context-menu/audio.svg';
import { ReactComponent as Camera } from '../../../assets/bottom-bar/context-menu/camera.svg';
import { ReactComponent as Files } from '../../../assets/bottom-bar/context-menu/files.svg';
import { ReactComponent as Images } from '../../../assets/bottom-bar/context-menu/images.svg';
import { ReactComponent as FrowardSvg } from '../../../assets/bottom-bar/forward.svg';
import { ReactComponent as MicSvg } from '../../../assets/bottom-bar/mic.svg';
import { ReactComponent as SendSvg } from '../../../assets/bottom-bar/send.svg';
import { ReactComponent as DeleteSvg } from '../../../assets/bottom-bar/trash.svg';
import { ReactComponent as PauseIconBtn } from '../../../assets/message/pause_icon.svg';
import {
  ALLOWED_IMAGE_TYPE_FORMAT,
  AUDIO_TYPE_FORMAT,
  FILE_FORMAT_MESSAGE,
  FILE_INCORRECT_ERROR,
  FILE_NOT_ERROR,
  FILE_SELECT_ERROR_5,
  FILE_SIZE_ERROR_MESSAGE_20,
  FILE_TYPE_FORMAT,
} from '../../../constant/infoTooltipMessages';
import {
  ATTACHMENTS_CONTEXT_MENU_ID,
  MAX_SIZE_FILE,
} from '../../../constant/other-constants';
import useMicrophoneCheck from '../../../hooks/useMicrophoneCheck';
import useOutsideClick from '../../../hooks/useOutsideClick';
import useQuillContextMenu from '../../../hooks/useQuillContextMenu';
import useRecording from '../../../hooks/useRecording';
import CustomButton from '../../../ui/custom-button/Button';
import InputChatFile from '../../../ui/inputs/input-chat-file/InputChatFile';
import convertToBase64Async from '../../../utils/chat/convertToBase64Async';
import trimMessage from '../../../utils/chat/trimMessage';
import timerFormat from '../../../utils/timerFormat';
import AttachmentPopup from '../../popups/attachment-popup/AttachmentPopup';
import MicrophonePopup from '../../popups/microphone-popup/MicrophonePopup';
import WaveserferComponent from '../../wavesurfe/Waveserfer';
import CustomToolbar from '../custom-toolbar/CustomToolbar';

import 'react-quill/dist/quill.snow.css';
import './quill.custom.css';

import { WebSocketContext } from '../../../providers/Websoket';

import { MessageListItem } from '../../../types/chat/messageListItem';

import useWindowResize from '../../../hooks/useWindowResize';

import useChatListStore from '../../../store/chatListStore';
import { TChannels } from '../../../types/websoket/websoket.types';

import style from './bottomBar.module.scss';

interface Props {
  blockChat: boolean;
  resetSelectMes: () => void;
  selectedMes: MessageListItem[];
  toggleForwardPopup: () => void;
  selectRepliedMes: MessageListItem | null;
  uid: string;
  dropfiles: FileList | File[];
}
const BottomBar: FC<Props> = ({
  uid,
  blockChat,
  selectedMes,
  resetSelectMes,
  selectRepliedMes,
  toggleForwardPopup,
  dropfiles,
}) => {
  const [message, setMessage] = useState('');
  const [isQuillMenuShowing, setQuillMenuIsShowing] = useState(false);
  const [isAttachmentPopupOpen, setIsAttachmentPopupOpen] = useState(false);

  const { show } = useContextMenu();
  const [filesToPreview, setFilesToPreview] = useState<File[]>([]);
  const [fileType, setFileType] = useState<string>('');
  const [isAttachmentsContextMenuOpen, setAttachmentsContextMenuOpen] =
    useState(false);
  const contextMenuRef = useRef<HTMLDivElement>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState('');
  const [isAudioDeleted, setIsAudioDeleted] = useState(false);

  const timeIntervalRef = useRef(null);
  const nodeRef = useRef<any>(null);

  const { mobileL } = useWindowResize();

  // если да, то делаем запрос на получение информации о враче
  const getChatByUid = useChatListStore((state) => state.getChatByUid);
  const chatItem = getChatByUid(uid);

  const chatType = useMemo(() => {
    if (chatItem) return chatItem.chat_type;

    return TChannels.CHAT;
  }, [chatItem]);

  const chatKey = useMemo(() => {
    if (chatItem) return chatItem.chat_key;

    return '';
  }, [chatItem]);

  const contextSocket = useContext(WebSocketContext);

  const { handleCreateTextMessage } = contextSocket ?? {};

  const notifyError = (text: string) =>
    toast.error(text, {
      duration: 2000,
    });

  const { canIUseMicrophone, openModal, closeMicrophonePopup, errorType } =
    useMicrophoneCheck();

  const { startRecording, stopRecording } = useRecording(
    setIsRecording,
    setTimer,
    setAudioFile,
    setAudioUrl,
    timeIntervalRef
  );

  // *react Quill
  const quillModules = useMemo(
    () => ({
      toolbar: {
        container: '#my-toolbar',
      },
      keyboard: {
        bindings: {
          customEnter: {
            key: 'Enter',
            handler() {
              return false;
            },
          },
        },
      },
    }),
    []
  );

  const fileRef = useRef<HTMLInputElement>(null);
  const quillRef = useRef<ReactQuill>(null);
  const quillWrapperRef = useRef<HTMLDivElement>(null);
  const quillMenuRef = useRef<HTMLDivElement>(null);

  useQuillContextMenu(
    quillWrapperRef,
    quillMenuRef,
    setQuillMenuIsShowing,
    message
  );

  const hideQuillMenu = () => {
    setQuillMenuIsShowing(false);
  };

  useOutsideClick(quillMenuRef, hideQuillMenu);

  const quillMenuClasses = useMemo(
    () =>
      classNames(style.quillMenu, {
        [style.quillMenu_active]: isQuillMenuShowing,
      }),
    [isQuillMenuShowing]
  );

  const toggleAttachmentsContextMenu = useCallback(
    (event: React.MouseEvent<SVGSVGElement>) => {
      show({ event, id: ATTACHMENTS_CONTEXT_MENU_ID });
      setAttachmentsContextMenuOpen(true);
    },
    [setAttachmentsContextMenuOpen, show]
  );

  const handleFileTypeChange = useCallback(
    (type: string) => {
      setFileType(type);
      setTimeout(() => {
        if (fileRef.current) {
          fileRef.current.click();
        }
      }, 0);
    },
    [setFileType, fileRef.current]
  );

  const resetInputValue = () => {
    resetSelectMes();
    setMessage('');
  };

  const handleResetFile = () => {
    setFilesToPreview([]);
    if (fileRef.current) {
      fileRef.current.value = '';
    }
  };

  const handleErrorChangeFile = (erMes: string) => {
    notifyError(erMes);
    handleResetFile();
  };

  const handleFileChange = async (files: FileList | File[]) => {
    const type = [
      ...FILE_TYPE_FORMAT,
      ...AUDIO_TYPE_FORMAT,
      ...ALLOWED_IMAGE_TYPE_FORMAT,
    ];

    if (!files || files.length === 0) {
      return handleErrorChangeFile(FILE_NOT_ERROR);
    }

    if (files.length > 5) {
      return handleErrorChangeFile(FILE_SELECT_ERROR_5);
    }

    const notAccept = Array.from(files).some((file) => {
      if (file && !type.includes(file.type)) {
        return true;
      }

      return false;
    });

    if (notAccept) {
      return handleErrorChangeFile(FILE_FORMAT_MESSAGE);
    }

    const hasEmptyFiles = Array.from(files).some((file) => {
      if (file.size === 0) {
        return true;
      }
      return false;
    });

    const hasMaxSizeFilex = Array.from(files).some((file) => {
      if (file.size > MAX_SIZE_FILE) {
        return true;
      }
      return false;
    });

    if (hasMaxSizeFilex) {
      return handleErrorChangeFile(FILE_SIZE_ERROR_MESSAGE_20);
    }

    if (hasEmptyFiles) {
      return handleErrorChangeFile(FILE_INCORRECT_ERROR);
    }

    setFilesToPreview(Array.from(files));
    setAttachmentsContextMenuOpen(false);
    return setIsAttachmentPopupOpen(true);
  };

  useEffect(() => {
    if (dropfiles && dropfiles.length > 0) {
      handleFileChange(dropfiles);
    }
  }, [dropfiles]);

  const hideContextMenu = () => {
    setAttachmentsContextMenuOpen(false);
  };

  const handleCloseAttachmentPopup = () => {
    setIsAttachmentPopupOpen(false);
  };

  const handleDeleteAudio = () => {
    setIsAudioDeleted(true);
    setAudioFile(null);
    setAudioUrl('');
    setTimer(0);
  };

  const cleanedMessage = useMemo(() => {
    return message.replace(/(<p><br><\/p>)+/g, '').trim();
  }, [message]);

  const isMessageValid = useMemo(() => {
    return !!cleanedMessage;
  }, [message]);

  const isMessageEmpty = useMemo(() => {
    return !cleanedMessage;
  }, [message]);

  const handleCreateMessage = async (event?: FormEvent<HTMLFormElement>) => {
    if (!uid) return;

    if (event) event.preventDefault();
    try {
      if (isMessageValid) {
        const trimmedMessage = trimMessage(message);
        if (handleCreateTextMessage)
          handleCreateTextMessage({
            type: chatType,
            chatKey,
            toUserUid: uid,
            content: {
              textContent: trimmedMessage,
              fileBlob: [],
              filesForLoading: [],
              forwardedMessages: [],
              repliedMEssage: selectRepliedMes ? [selectRepliedMes] : [],
            },
            resetValue: resetInputValue,
          });
      }
    } catch (error) {
      console.log(error);
      resetInputValue();
    }

    if (isAudioDeleted) {
      setIsAudioDeleted(false);
      setAudioUrl('');
    }
    try {
      if (audioFile && handleCreateTextMessage) {
        const base64Audio = await convertToBase64Async(audioFile);
        handleCreateTextMessage({
          type: chatType,
          chatKey,
          toUserUid: uid,
          content: {
            textContent: '<p></p>',
            fileBlob: [{ data: base64Audio, filename: audioFile.name }],
            filesForLoading: [audioFile],
            forwardedMessages: [],
            repliedMEssage: selectRepliedMes ? [selectRepliedMes] : [],
          },
          resetValue: () => {
            resetInputValue();
            handleDeleteAudio();
          },
        });
      }
    } catch (error) {
      console.log(error);
      handleDeleteAudio();
    }
  };

  const handleRecording = useCallback(() => {
    canIUseMicrophone();
    startRecording();
  }, [canIUseMicrophone, startRecording]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Enter') {
        const isModifier = event.shiftKey || event.altKey || event.metaKey;

        event.preventDefault();

        if (isModifier) {
          const quill = quillRef.current?.getEditor?.();
          if (quill) {
            const range = quill.getSelection();
            if (range) {
              quill.insertText(range.index, '\n');
              quill.setSelection(range.index + 1, 0);
            }
          }
        } else {
          handleCreateMessage();
        }
      }
    },
    [handleCreateMessage]
  );

  useOutsideClick(contextMenuRef, hideContextMenu);

  useEffect(() => {
    if (blockChat) {
      resetInputValue();
    }
    resetInputValue();
  }, [uid, blockChat]);

  useEffect(() => {
    if (
      (quillRef.current && quillRef.current.editor && uid) ||
      (quillRef.current && quillRef.current.editor && uid && selectRepliedMes)
    ) {
      quillRef.current.editor.focus();
    }
  }, [uid, quillRef.current, selectRepliedMes]);

  const iconsConfig = [
    {
      Component: AttachSvg,
      props: {
        onClick: (e: React.MouseEvent<SVGSVGElement>) => {
          e.preventDefault();
          if (!blockChat) {
            toggleAttachmentsContextMenu(e);
          }
        },
        className: classNames(style.attachBtn, {
          [style.cursorDef]: blockChat,
        }),
      },
      deps: [blockChat, toggleAttachmentsContextMenu],
    },
    { Component: Music, props: { className: style.icon }, deps: [style.icon] },
    { Component: Camera, props: { className: style.icon }, deps: [style.icon] },
    { Component: Files, props: { className: style.icon }, deps: [style.icon] },
    { Component: Images, props: { className: style.icon }, deps: [style.icon] },
    { Component: MicSvg, props: {}, deps: [] },
    { Component: SendSvg, props: {}, deps: [] },
    { Component: DeleteSvg, props: {}, deps: [] },
    { Component: PauseIconBtn, props: {}, deps: [] },
    {
      Component: FrowardSvg,
      props: {
        onClick: (e: React.MouseEvent<SVGSVGElement>) => {
          e.preventDefault();
          if (selectedMes.length > 0) toggleForwardPopup();
        },
        title: 'переслать сообщение',
        className: classNames(style.iconBar),
      },
      deps: [selectedMes, handleCreateTextMessage],
    },
    {
      Component: FrowardSvg,
      props: {
        onClick: (e: React.MouseEvent<SVGSVGElement>) => {
          e.preventDefault();
          console.log('переслать');
        },
        title: 'ответить',
        className: classNames(style.iconBar, style.scale, {
          [style.hidden]: selectedMes.length > 1,
        }),
      },
      deps: [selectedMes, handleCreateTextMessage],
    },
  ];

  const memoizedIcons = iconsConfig.map(({ Component, props, deps }) =>
    useMemo(() => <Component {...props} />, deps)
  );

  const [
    memoizedAttachIcon,
    memoizedMusicIcon,
    memoizedCameraIcon,
    memoizedFilesIcon,
    memoizedImagesIcon,
    memoizedMicIcon,
    memoizedSendIcon,
    memoizedDeleteIcon,
    memoizedPauseIcon,
    memorizeSendForwardMes,
    memorizeRepliedMes,
  ] = memoizedIcons;

  const quillClassName = useMemo(() => {
    return classNames(style.message, {
      [style.cursorDef]: blockChat,
    });
  }, [blockChat, style.message, style.cursorDef]);

  const micButtonClassName = useMemo(() => {
    return classNames(style.btn, {
      [style.cursorDef]: blockChat,
    });
  }, [blockChat]);

  return (
    <div className={style.bar}>
      <SwitchTransition mode="out-in">
        <CSSTransition
          nodeRef={nodeRef}
          addEndListener={(done: () => void) => {
            nodeRef.current?.addEventListener('transitionend', done, false);
          }}
          classNames="fadeVerticalOne"
          key={selectedMes.length ? 'select' : 'write'}
        >
          <div ref={nodeRef} className={classNames(style.bottomBar)}>
            {selectedMes.length ? (
              <div className={style.select}>
                <div
                  style={{ width: '30px', height: '30px' }}
                  className={classNames(style.selectCancel)}
                >
                  {memorizeRepliedMes}
                </div>
                <div className={classNames(style.selectAttach)}>
                  <span>Выбрано: {selectedMes.length}</span>
                </div>
                <div className={classNames(style.selectAction)}>
                  {memorizeSendForwardMes}
                </div>
              </div>
            ) : (
              <form
                className={style.messageForm}
                onSubmit={handleCreateMessage}
              >
                {!isRecording && !audioUrl && !openModal && (
                  <>
                    <div ref={contextMenuRef}>
                      {memoizedAttachIcon}
                      <Menu
                        id={ATTACHMENTS_CONTEXT_MENU_ID}
                        className={classNames(style.contextMenu, {
                          [style.contextMenuHide]:
                            !isAttachmentsContextMenuOpen,
                        })}
                      >
                        <Item
                          onClick={() => {
                            handleFileTypeChange(
                              `${ALLOWED_IMAGE_TYPE_FORMAT}`
                            );
                            hideContextMenu();
                          }}
                        >
                          {memoizedCameraIcon}
                          <span>Камера</span>
                        </Item>
                        <Item
                          onClick={() => {
                            handleFileTypeChange(
                              `${ALLOWED_IMAGE_TYPE_FORMAT}`
                            );
                            hideContextMenu();
                          }}
                        >
                          {memoizedImagesIcon}
                          <span>Изображения</span>
                        </Item>
                        <Item
                          onClick={() => {
                            handleFileTypeChange(`${FILE_TYPE_FORMAT}`);
                            hideContextMenu();
                          }}
                        >
                          {memoizedFilesIcon}
                          <span>Файлы</span>
                        </Item>
                        <Item
                          onClick={() => {
                            handleFileTypeChange(`${AUDIO_TYPE_FORMAT}`);
                            hideContextMenu();
                          }}
                        >
                          {memoizedMusicIcon}
                          <span>Музыка</span>
                        </Item>
                      </Menu>
                    </div>
                    <InputChatFile
                      onChange={(e) => {
                        if (e.target.files) {
                          handleFileChange(e.target.files);
                        }
                      }}
                      fileRef={fileRef}
                      fileType={fileType}
                    />
                    {filesToPreview && (
                      <AttachmentPopup
                        chatKey={chatKey}
                        chatType={chatType}
                        selectRepliedMes={selectRepliedMes}
                        files={filesToPreview}
                        resetSelectMes={resetSelectMes}
                        isOpen={isAttachmentPopupOpen}
                        onClose={handleCloseAttachmentPopup}
                        onReset={handleResetFile}
                      />
                    )}

                    <div className={style.quillWrapper} ref={quillWrapperRef}>
                      <ReactQuill
                        readOnly={blockChat}
                        ref={quillRef}
                        id="message"
                        value={message || ''}
                        onChange={setMessage}
                        modules={quillModules}
                        className={quillClassName}
                        placeholder={
                          mobileL ? 'Ваш текст' : 'Введите текст сообщения'
                        }
                        onKeyDown={handleKeyDown}
                      />
                    </div>
                    <div className={quillMenuClasses} ref={quillMenuRef}>
                      <CustomToolbar />
                    </div>
                    {!isRecording && isMessageEmpty && (
                      <CustomButton
                        type="button"
                        onClick={handleRecording}
                        disabled={isRecording || blockChat}
                        className={micButtonClassName}
                        title="Начать запись"
                        aria-label="Начать запись"
                      >
                        {memoizedMicIcon}
                      </CustomButton>
                    )}
                  </>
                )}

                {isMessageValid && (
                  <CustomButton
                    type="submit"
                    className={style.btn}
                    title={`Shift + Enter - перенос строки \nEnter - отправить сообщение`}
                    aria-label={`Shift + Enter - перенос строки \n Enter - отправить сообщение`}
                  >
                    {memoizedSendIcon}
                  </CustomButton>
                )}

                {isRecording && !openModal && (
                  <div className={style.recording}>
                    <span>Идёт запись</span>
                    <div className={style.indicator}> </div>
                    <time>{timerFormat(timer)}</time>
                    <CustomButton
                      type="button"
                      styleBtn="blue"
                      onClick={stopRecording}
                      disabled={!isRecording}
                      title="Остановить запись"
                      aria-label="Остановить запись"
                    >
                      {memoizedPauseIcon}
                    </CustomButton>
                  </div>
                )}

                {audioUrl && !openModal && (
                  <>
                    <CustomButton
                      type="button"
                      onClick={handleDeleteAudio}
                      className={style.btn}
                      title="Удалить запись"
                      aria-label="Удалить запись"
                    >
                      {memoizedDeleteIcon}
                    </CustomButton>
                    <WaveserferComponent
                      localFileUrl={audioUrl}
                      recordAudio={isRecording}
                    />
                    <CustomButton
                      title="Отправить запись"
                      aria-label="Отправить запись"
                      type="submit"
                      className={style.btn}
                    >
                      {memoizedSendIcon}
                    </CustomButton>
                  </>
                )}
              </form>
            )}
          </div>
        </CSSTransition>
      </SwitchTransition>
      {openModal && (
        <MicrophonePopup
          openModal={openModal}
          closeMicrophonePopup={closeMicrophonePopup}
          errorType={errorType}
        />
      )}
    </div>
  );
};

export default BottomBar;

import { FC, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'react-router';

import { ReactComponent as PencilSvg } from '../../../assets/bottom-bar/pencil.svg';
import { ALLOWED_IMAGE_TYPE_FORMAT } from '../../../constant/infoTooltipMessages';
import { WebSocketContext } from '../../../providers/Websoket';
import CustomButton from '../../../ui/custom-button/Button';
import Popup from '../../../ui/popup/Popup';
import convertToBase64Async from '../../../utils/chat/convertToBase64Async';
import FileItem from '../../message-item/FileItem/FileItem';

import { MessageListItem } from '../../../types/chat/messageListItem';

import { useEventListener } from '../../../hooks/useEventListener';
import useWindowResize from '../../../hooks/useWindowResize';

import { TChannels } from '../../../types/websoket/websoket.types';

import style from './AttachmentPopup.module.scss';

interface AttachmentPopupProps {
  files: File[];
  isOpen: boolean;
  onReset: () => void;
  onClose: () => void;
  resetSelectMes: () => void;
  selectRepliedMes: MessageListItem | null;
  chatKey: string;
  chatType: TChannels;
}

const AttachmentPopup: FC<AttachmentPopupProps> = ({
  files,
  isOpen,
  onReset,
  onClose,
  resetSelectMes,
  selectRepliedMes,
  chatKey,
  chatType,
}) => {
  const { uid } = useParams<{ uid: string }>();
  const contextSocket = useContext(WebSocketContext);
  const { handleCreateTextMessage } = contextSocket ?? {};
  const { mobileL } = useWindowResize();
  const [previews, setPreviews] = useState<string[]>([]);
  const [messageText, setMessageText] = useState<string>('');
  const isImageFile =
    files.length > 0 && ALLOWED_IMAGE_TYPE_FORMAT.includes(files[0].type);

  // предварительный просмотр изображений или файлов
  useEffect(() => {
    const objectUrls: string[] = [];
    files.forEach((file) => {
      objectUrls.push(URL.createObjectURL(file));
    });
    setPreviews(objectUrls);
    return () => {
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files]);

  const handleSubmit = async () => {
    if (!uid || !files) return;

    try {
      const fileConversionPromises =
        Array.from(files).map(convertToBase64Async);
      // дожидаемся конвертации всех файлов
      const results = await Promise.all(fileConversionPromises);

      // отправка файлового сообщения через сокеты
      if (handleCreateTextMessage) {
        const content = {
          textContent: messageText || '<p></p>',
          fileBlob: results.map((base64File, index) => ({
            data: base64File,
            filename: files[index].name,
          })),
          filesForLoading: files,
          forwardedMessages: [],
          repliedMEssage: selectRepliedMes ? [selectRepliedMes] : [],
        };
        handleCreateTextMessage({
          chatKey,
          type: chatType,
          toUserUid: uid,
          content,
          resetValue: () => {
            resetSelectMes();
            onReset();
            onClose();
            setMessageText('');
          },
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Ошибка: ${error.message}`);
      } else {
        toast.error('Произошла ошибка');
      }
      onReset();
      onClose();
      setMessageText('');
    }
  };

  const handleCancel = () => {
    onReset();
    onClose();
    setMessageText('');
  };

  useEventListener('keydown', (e) => {
    if (e.key === 'Enter' && isOpen && isImageFile) {
      e.preventDefault();
      handleSubmit();
    }
  });

  useEffect(() => {
    if (!isOpen) {
      if (files.length) {
        onReset();
        setMessageText('');
      }
    }
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <Popup
          extraClass={style.attachmentPopup}
          onClose={onClose}
          isOpen={isOpen}
        >
          <div className={style.previewContainer}>
            {files.map((file, index) => {
              return (
                <FileItem
                  key={file.name}
                  fileName={file.name}
                  fileSize={file.size}
                  fileImageSrc={isImageFile ? previews[index] : null}
                />
              );
            })}
          </div>
          <div className={style.text}>
            <PencilSvg className={style.icon} />
            <input
              id="message"
              name="message"
              className={style.input}
              placeholder={mobileL ? 'Ваш текст' : 'Введите текст сообщения'}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
            />
          </div>
          <div className={style.buttons}>
            <CustomButton
              textBtn="Отменить"
              title="отменить: ESC"
              styleBtn="secondary"
              onClick={handleCancel}
              classNameBtn={style.button}
            />
            <CustomButton
              textBtn="Отправить"
              onClick={handleSubmit}
              title="отправить: Enter"
              classNameBtn={style.button}
            />
          </div>
        </Popup>
      )}
    </>
  );
};

export default AttachmentPopup;

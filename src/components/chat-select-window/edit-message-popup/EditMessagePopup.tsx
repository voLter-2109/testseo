import { FC, useContext, useEffect, useRef, useState } from 'react';
import ReactQuill from 'react-quill';

import { MessageListItem } from '../../../types/chat/messageListItem';
import Button from '../../../ui/custom-button/Button';
import Popup from '../../../ui/popup/Popup';

import { WebSocketContext } from '../../../providers/Websoket';

import 'react-quill/dist/quill.snow.css';
import useWindowResize from '../../../hooks/useWindowResize';

import CrossBtn from '../../../ui/cross-button/CrossBtn';

import style from './editMessagePopup.module.scss';

import './quill.custom.css';

interface EditMessagePopupProps {
  isOpen: boolean;
  editingMessage: MessageListItem | null;
  setEditingMessage: (value: MessageListItem | null) => void;
  blockChat: boolean;
}

const EditMessagePopup: FC<EditMessagePopupProps> = ({
  isOpen,
  editingMessage,
  setEditingMessage,
  blockChat,
}) => {
  const { mobileL } = useWindowResize();

  const quillRef = useRef<ReactQuill>(null);

  const modules = {
    toolbar: {
      container: '#my-toolbar',
    },
  };

  const contextSocket = useContext(WebSocketContext);

  const [messageToEdit, setMessageToEdit] = useState<string>(
    editingMessage?.content || ''
  );

  const { handleEditMessage } = contextSocket ?? {};

  const handleUpdateMessage = (e: any) => {
    e.preventDefault();

    if (editingMessage && handleEditMessage) {
      handleEditMessage(editingMessage, messageToEdit);
      setEditingMessage(null);
    }
  };

  useEffect(() => {
    setMessageToEdit(editingMessage?.content || '');
  }, [editingMessage]);

  return (
    <Popup
      extraClass={style.editingPopup}
      onClose={() => setEditingMessage(null)}
      isOpen={isOpen}
    >
      <div className={style.editingMessageTitleWrapper}>
        <CrossBtn onClick={() => setEditingMessage(null)} />
        <h3 className={style.editingMessageTitle}>Редактирование сообщения</h3>
      </div>
      <form
        action="submit"
        className={style.editingMessageForm}
        onSubmit={handleUpdateMessage}
      >
        <ReactQuill
          className={style.editingInput}
          readOnly={blockChat}
          ref={quillRef}
          id="messageChangeMes"
          modules={modules}
          value={messageToEdit}
          onChange={setMessageToEdit}
          placeholder={mobileL ? 'Ваш текст' : 'Введите текст сообщения'}
          onKeyDown={() => {}}
        />
        <div className={style.editingMessageButtonsWrapper}>
          <Button
            styleBtn="secondary"
            onClick={() =>
              editingMessage && setMessageToEdit(editingMessage.content)
            }
          >
            Сбросить
          </Button>
          <Button styleBtn="primary" type="submit">
            Отправить
          </Button>
        </div>
      </form>
    </Popup>
  );
};

export default EditMessagePopup;

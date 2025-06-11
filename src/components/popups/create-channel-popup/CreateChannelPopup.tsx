import classNames from 'classnames';
import { FC, useContext, useEffect, useRef, useState } from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';

import Popup from '../../../ui/popup/Popup';

import ChannelUsers from '../../registration/channel-block/ChannelUsers';

import { CreateChannelForm } from '../../../types/channel/createForm';
import {
  ObjectCreateChannel,
  TChannels,
} from '../../../types/websoket/websoket.types';
import CrossBtn from '../../../ui/cross-button/CrossBtn';
import ChannelInfo from '../../registration/channel-block/ChannelInfo';

import { WebSocketContext } from '../../../providers/Websoket';

import convertToBase64Async from '../../../utils/chat/convertToBase64Async';

import style from './CreateChannelPopup.module.scss';

interface CreateChannelPopupProps {
  isOpen: boolean;
  onClose: () => void;
  type: TChannels.PUBLIC_GROUP | TChannels.PUBLIC_CHANNEL;
}

const CreateChannelPopup: FC<CreateChannelPopupProps> = ({
  isOpen,
  onClose,
  type,
}) => {
  // ref и trigger для CSSTransition
  const nodeRef = useRef<any>(null);
  const [trigger, setTrigger] = useState(true);
  const [defForm, setDefForm] = useState<CreateChannelForm>({
    name: '',
    desc: '',
    avatar: null,
    typeChat: type,
    privateChanel: false,
    newAvatarUrl: '',
  });

  const contextSocket = useContext(WebSocketContext);

  const { createChannel } = contextSocket ?? {};

  const handleChangeDataForm = (d: CreateChannelForm) => {
    setDefForm(d);
  };

  useEffect(() => {
    console.log(defForm);
  }, [defForm]);

  const toggleTrigger = () => {
    setTrigger((prev) => !prev);
  };

  // тут будет функция от сокета для создания группы
  const handleCreateChannel = async (selectChat: string[]) => {
    const { avatar, desc, name, privateChanel, typeChat } = defForm;

    const t = privateChanel ? typeChat.replace('public', 'private') : typeChat;
    if (createChannel) {
      let newAvatar: {
        filename: string;
        data: string;
      } | null = null;

      try {
        if (avatar && avatar[0]) {
          const base64Audio = await convertToBase64Async(avatar[0]);
          newAvatar = {
            data: base64Audio,
            filename: avatar[0].name,
          };
        } else {
          newAvatar = null;
        }
      } catch (error) {
        console.error(error);
      }

      const newChannel: ObjectCreateChannel = {
        avatar: newAvatar,
        description: desc,
        name,
        type: t as TChannels,
        uid_users_list: selectChat,
      };

      // тут функция от сокета, обьект подходит по типу с пропсам функции
      createChannel(newChannel, avatar);
      onClose();
    }

    return null;
  };

  return (
    <>
      {isOpen && (
        <Popup
          extraClass={style.createChannelPopup}
          onClose={onClose}
          isOpen={isOpen}
        >
          <CrossBtn onClick={onClose} />
          <h1 className={style.header}>
            Создание {type.includes('group') ? <>группы</> : <>канала</>}
          </h1>
          <SwitchTransition mode="out-in">
            <CSSTransition
              nodeRef={nodeRef}
              addEndListener={(done: () => void) => {
                nodeRef.current?.addEventListener('transitionend', done, false);
              }}
              classNames="fade"
              style={{ height: '85%' }}
              key={trigger ? 'info' : 'users'}
            >
              <div
                ref={nodeRef}
                className={classNames(style.createChannelBlock)}
              >
                {trigger ? (
                  <ChannelInfo
                    setTrigger={toggleTrigger}
                    onClose={onClose}
                    defForm={defForm}
                    handleChangeDataForm={handleChangeDataForm}
                  />
                ) : (
                  <ChannelUsers
                    setTrigger={toggleTrigger}
                    createChannel={handleCreateChannel}
                  />
                )}
              </div>
            </CSSTransition>
          </SwitchTransition>
        </Popup>
      )}
    </>
  );
};

export default CreateChannelPopup;

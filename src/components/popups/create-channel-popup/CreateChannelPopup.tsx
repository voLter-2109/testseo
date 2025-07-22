import classNames from 'classnames';
import { FC, useContext, useEffect, useRef, useState } from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';

import toast from 'react-hot-toast';

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

import userStore from '../../../store/userStore';

import useChatListStore from '../../../store/chatListStore';

import ClearOrDelModal from '../yes-or-no-popup/YesOrNoModal';

import { PropsYesOrNo, ThemeEnum } from '../../../types/menu/menu';

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
  const nodeRef = useRef<any>(null);
  const [trigger, setTrigger] = useState(true);
  const [yesOrNoState, setYesOrNoState] = useState<PropsYesOrNo>(null);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [defForm, setDefForm] = useState<CreateChannelForm>({
    name: '',
    desc: '',
    avatar: null,
    typeChat: type,
    privateChanel: false,
    newAvatarUrl: '',
  });

  const user = userStore((state) => state.user);
  const contextSocket = useContext(WebSocketContext);

  const { createChannel } = contextSocket ?? {};
  const creatingStatus = useChatListStore((state) => state.creatingStatus);
  const updateStatusCreating = useChatListStore(
    (state) => state.updateStatusCreating
  );

  const handleChangeDataForm = (d: CreateChannelForm) => {
    setDefForm(d);
  };

  const handleRequestClose = () => {
    console.log('handleRequestClose called');
    const hasUnsavedData =
      defForm.name.trim() !== '' ||
      defForm.desc.trim() !== '' ||
      selectedUsers.length > 0 ||
      defForm.avatar !== null;

    if (hasUnsavedData) {
      setYesOrNoState({
        type: ThemeEnum.CREATE_CHANNEL_EXIT,
        selMes: null,
      });
    } else {
      onClose();
    }
  };

  const toggleTrigger = () => {
    setTrigger((prev) => !prev);
  };

  const handleCreateChannel = async (selectChat: string[]) => {
    const { avatar, desc, name, privateChanel, typeChat } = defForm;

    const t = privateChanel ? typeChat.replace('public', 'private') : typeChat;

    if (!createChannel || !contextSocket) return;

    updateStatusCreating?.({
      status: 'loading',
      error: undefined,
      action: 'create_chat',
      request_uid: '',
    });

    let newAvatar: { filename: string; data: string } | null = null;

    try {
      if (avatar && avatar[0]) {
        const base64Audio = await convertToBase64Async(avatar[0]);
        newAvatar = {
          data: base64Audio,
          filename: avatar[0].name,
        };
      }

      const newChannel: ObjectCreateChannel = {
        avatar: newAvatar,
        description: desc,
        name,
        chat_type: t as TChannels,
        uid_users_list: selectChat,
      };

      createChannel(newChannel, user?.uid || '');
    } catch (avatarError) {
      toast.error(`Ошибка при загрузке аватара ${avatarError}`);
    }
  };

  useEffect(() => {
    if (!creatingStatus?.status) return;

    if (creatingStatus?.status === 'OK') {
      toast.success('Канал успешно создан!');
      onClose();
    }
  }, [creatingStatus?.status]);

  useEffect(() => {
    return () => {
      updateStatusCreating?.(null);
    };
  }, []);

  return (
    <>
      {(isOpen || yesOrNoState) && (
        <Popup
          extraClass={style.createChannelPopup}
          onClose={handleRequestClose}
          isOpen={isOpen && !yesOrNoState}
        >
          <CrossBtn
            onClick={() => {
              console.log('CrossBtn clicked');
              handleRequestClose();
            }}
          />
          <h1 className={style.header}>
            Создание {type.includes('group') ? <>группы</> : <>канала</>}
          </h1>
          {creatingStatus?.status === 'loading' && (
            <div className={style.loading}>Создание...</div>
          )}
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
                    onClose={handleRequestClose}
                    defForm={defForm}
                    handleChangeDataForm={handleChangeDataForm}
                  />
                ) : (
                  <ChannelUsers
                    setTrigger={toggleTrigger}
                    createChannel={handleCreateChannel}
                    selectedUsers={selectedUsers}
                    setSelectedUsers={setSelectedUsers}
                    loading={creatingStatus?.status === 'loading'}
                    error={!!creatingStatus?.error}
                  />
                )}
              </div>
            </CSSTransition>
          </SwitchTransition>
        </Popup>
      )}
      {yesOrNoState && (
        <ClearOrDelModal
          isOpen={yesOrNoState}
          onClose={() => setYesOrNoState(null)}
          handleFunc={() => {
            setYesOrNoState(null);
            onClose();
          }}
        />
      )}
    </>
  );
};

export default CreateChannelPopup;

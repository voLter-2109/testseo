import classNames from 'classnames';
import { FC, memo, useState } from 'react';

import { ChatsListItem } from '../../../types/chat/chat';
import { DoctorInfo } from '../../../types/doctor/doctor';
import Divider from '../../../ui/divider/Divider';
import RootBoundaryComponent from '../../../ui/error-component/RootBoundaryComponent';

import { ReactComponent as DoctorSvg } from '../../../assets/doctors/doctor_scientific_degree_label.svg';
import { ReactComponent as ChatSvg } from '../../../assets/side-menu/message.svg';
import NavBarDoctorList from '../nav-bar-list/doctorList/NavBarDoctorList';

import NavBarChatList from '../nav-bar-list/chatList/NavBarChatList';

import { MessageListItem } from '../../../types/chat/messageListItem';
import NavBarMessageList from '../nav-bar-list/messageList/NavBarMessageList';

import style from './searchNavBarList.module.scss';

type Props = {
  isError: boolean;
  refresh: () => void;
  isFetchChat: boolean;
  isFetchDoctor: boolean;
  isTableBarActive: boolean;
  doctorList: DoctorInfo[] | null;
  chatList: ChatsListItem[] | null;
  allSearchMessages: MessageListItem[];
  refDoctor: (node?: Element | null) => void;
};

/**
 *
 * @param param0
 * @returns компонент для формирования верстки для компонента вывода чатов при поиске
 */

const SearchNavBarList: FC<Props> = ({
  isFetchDoctor,
  isFetchChat,
  refDoctor,
  refresh,

  isError,
  chatList,
  doctorList,
  isTableBarActive,
  allSearchMessages,
}) => {
  const [showAllChat, setShowChat] = useState(false);
  const [showAllDoctor, setShowDoctor] = useState(false);

  if (isError)
    return <RootBoundaryComponent refreshFunc={refresh} ariaTitle="обновить" />;

  if (
    chatList &&
    chatList.length === 0 &&
    doctorList &&
    doctorList.length === 0
  )
    return (
      <p
        style={{
          textAlign: 'center',
        }}
      >
        Ничего не найдено
      </p>
    );

  return (
    <div className={style.searchWrapper}>
      {allSearchMessages && allSearchMessages.length !== 0 && (
        <div style={{ marginBottom: '15px' }}>
          <p
            style={{
              textAlign: 'start',
            }}
          >
            <ChatSvg className={style.icon} title="найденные сообщения" />
          </p>
          <Divider />

          <NavBarMessageList listData={allSearchMessages} />
        </div>
      )}
      {chatList && chatList.length !== 0 && (
        <div style={{ marginBottom: '15px' }}>
          <p
            style={{
              textAlign: 'start',
            }}
          >
            <ChatSvg className={style.icon} title="найденные чаты" />
          </p>
          <Divider />
          <div
            className={classNames(style.showNotAll, {
              [style.showAll]: showAllChat,
            })}
          >
            <NavBarChatList
              listData={chatList}
              isTableBarActive={isTableBarActive}
            />
            {isFetchChat && <p>Загрузка...</p>}
          </div>
          {chatList.length > 5 && (
            <button
              onClick={() => setShowChat((prev) => !prev)}
              type="button"
              title={showAllChat ? 'свернуть' : 'раскрыть'}
              aria-label={showAllChat ? 'свернуть' : 'раскрыть'}
              className={classNames(style.btn, {
                [style.showBtn]: showAllChat,
              })}
            >
              {'>'}
            </button>
          )}
        </div>
      )}

      {doctorList?.length !== 0 && doctorList && (
        <div>
          <p
            style={{
              textAlign: 'start',
            }}
          >
            <DoctorSvg className={style.icon} title="найденные доктора" />
          </p>
          <Divider />
          <div
            className={classNames(style.showNotAll, {
              [style.showAll]: showAllDoctor,
            })}
          >
            <NavBarDoctorList listData={doctorList} refDocLast={refDoctor} />
            {isFetchDoctor && <p>Загрузка...</p>}
          </div>
          {doctorList?.length > 5 && (
            <button
              onClick={() => setShowDoctor((prev) => !prev)}
              type="button"
              title={showAllDoctor ? 'свернуть' : 'раскрыть'}
              aria-label={showAllDoctor ? 'свернуть' : 'раскрыть'}
              className={classNames(style.btn, {
                [style.showBtn]: showAllDoctor,
              })}
            >
              {'>'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default memo(SearchNavBarList);

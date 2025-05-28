import { FC, memo } from 'react';

import { ChatsListItem } from '../../../types/chat/chat';
import { DoctorInfo } from '../../../types/doctor/doctor';
import RootBoundaryComponent from '../../../ui/error-component/RootBoundaryComponent';
import NavBarChatList from '../nav-bar-list/chatList/NavBarChatList';
import NavBarDoctorList from '../nav-bar-list/doctorList/NavBarDoctorList';
import NavBarChannelList from '../nav-bar-list/channelList.tsx/NavBarChannelList';

type Props = {
  isError: boolean;
  refresh: () => void;
  isFetchChat: boolean;
  isFetchDoctor: boolean;
  isTableBarActive: boolean;
  isShowArchivedChats: boolean;
  isShowChannels: boolean;
  chatList: ChatsListItem[] | undefined;
  doctorsList: DoctorInfo[] | undefined;
  refDoctor: (node?: Element | null) => void;
};

const DefaultNavBarList: FC<Props> = ({
  isFetchDoctor,
  isFetchChat,
  refDoctor,
  refresh,
  isError,
  chatList,
  doctorsList,
  isTableBarActive,
  isShowArchivedChats,
  isShowChannels,
}) => {
  if (isError)
    return <RootBoundaryComponent refreshFunc={refresh} ariaTitle="обновить" />;

  if (isShowChannels) {
    return (
      <>
        <NavBarChannelList />
      </>
    );
  }

  if (chatList && chatList.length > 0) {
    return (
      <>
        <NavBarChatList
          listData={chatList}
          isTableBarActive={isTableBarActive}
        />
        {isFetchChat && <p>Загрузка...</p>}
      </>
    );
  }

  if (isShowArchivedChats && chatList?.length === 0) {
    return (
      <p
        style={{
          textAlign: 'center',
        }}
      >
        Тут еще ничего нет
      </p>
    );
  }

  if (doctorsList && doctorsList.length) {
    return (
      <>
        <NavBarDoctorList refDocLast={refDoctor} listData={doctorsList} />
        {isFetchDoctor && <p>Загрузка...</p>}
      </>
    );
  }

  if (chatList?.filter((i) => i.is_active).length === 0) {
    return (
      <p
        style={{
          textAlign: 'center',
        }}
      >
        Тут еще ничего нет
      </p>
    );
  }

  return <p>Что то пошло не так...</p>;
};

export default memo(DefaultNavBarList);

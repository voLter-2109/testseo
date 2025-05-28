import { memo } from 'react';
import { useAutoAnimate } from '@formkit/auto-animate/react';

import ChannelItem from '../../../chat-item/ChannelItem';
import ChannelAdminItem from '../../../chat-item/ChannelAdminItem';
import GroupItem from '../../../chat-item/GroupItem';

const NavBarChannelList = () => {
  const [listRef] = useAutoAnimate();

  // Добавляем из store группы и каналы ChannelItem, GroupItem
  return (
    <ul ref={listRef}>
      <li>
        <ChannelItem />
      </li>
      <li>
        <ChannelAdminItem />
      </li>
      <li>
        <GroupItem />
      </li>
    </ul>
  );
};

export default memo(NavBarChannelList);

import { useAutoAnimate } from '@formkit/auto-animate/react';
import { FC, memo, useMemo } from 'react';

import { MessageListItem } from '../../../../types/chat/messageListItem';
import MessageItemWithSearch from '../../../../ui/messageItemInLeftNavBar/MessageItemWithSearch';

type Props = {
  listData: MessageListItem[];
};

const NavBarMessageList: FC<Props> = ({ listData }) => {
  const [listRef] = useAutoAnimate();

  const filterList = useMemo(() => {
    return listData.sort((a, b) => {
      return b.created_at - a.created_at;
    });
  }, [listData]);

  return (
    <ul ref={listRef}>
      {filterList.map((m) => {
        return (
          <li key={m.id}>
            <MessageItemWithSearch m={m} />
          </li>
        );
      })}
    </ul>
  );
};

export default memo(NavBarMessageList);

import { NavLink } from 'react-router-dom';
import { memo, useMemo, useRef } from 'react';
import classNames from 'classnames';

import Avatar from '../avatar/Avatar';
import avatar from '../../assets/side-menu/tempGroupImg.png';

import OnlineCheck from '../../ui/OnlineCheck/OnlineCheck';

import Badge from '../../ui/badge/Badge';

import style from './ChatItem.module.scss';

const GroupItem = () => {
  const isOnline = true;

  const chatItemRef = useRef<HTMLDivElement | null>(null);

  const titleOnline = useMemo(() => {
    if (isOnline) {
      return 'в сети';
    }
    return 'не в сети';
  }, [isOnline]);

  return (
    <div ref={chatItemRef}>
      <NavLink
        to="944d1dae-4d38-4c3b-b010-2b70gr7o7u7p"
        className={style.chatItem}
      >
        <div className={style.wrapperAvatar}>
          <Avatar
            img={avatar}
            size="medium"
            extraClassName={style.chatItemAvatar}
          />
          <div title={titleOnline}>
            <OnlineCheck isOnline />
          </div>
        </div>
        <div className={style.content}>
          <h3 className={style.name} title="Группа любителей ЗОЖ">
            Группа любителей ЗОЖ
          </h3>

          <div className={style.message}>30 подтягиваний и 50 отжиманий</div>
        </div>
        <div
          className={classNames(style.info, {
            [style.info_bottom]: 0,
          })}
        >
          <Badge count={21} type="new" />

          <div className={style.date}>19.05.25</div>
        </div>
      </NavLink>
    </div>
  );
};

export default memo(GroupItem);

import { NavLink } from 'react-router-dom';
import { memo, useMemo, useRef } from 'react';
import classNames from 'classnames';

import Avatar from '../avatar/Avatar';
import avatar from '../../assets/side-menu/tempChannelImg.jpg';

import OnlineCheck from '../../ui/OnlineCheck/OnlineCheck';

import Badge from '../../ui/badge/Badge';

import style from './ChatItem.module.scss';

const ChannelItem = () => {
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
        to="944d1dae-4d38-4c3b-b010-2b70bu7s7e7r"
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
          <h3 className={style.name} title="Канал о здоровье">
            Пользователи видят этот канал
          </h3>

          <div className={style.message}>
            Сон и микрофлора кишечника сильно взаимосвязаны
          </div>
        </div>
        <div
          className={classNames(style.info, {
            [style.info_bottom]: 0,
          })}
        >
          <Badge count={2} type="new" />

          <div className={style.date}>19.05.25</div>
        </div>
      </NavLink>
    </div>
  );
};

export default memo(ChannelItem);

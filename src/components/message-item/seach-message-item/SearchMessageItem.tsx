import classNames from 'classnames';
import { Interweave } from 'interweave';
import { FC, useMemo } from 'react';

import { MessageListItem } from '../../../types/chat/messageListItem';

import avatar from '../../../assets/side-menu/avatar.svg';
import Avatar from '../../avatar/Avatar';

import { ReactComponent as AttachSvg } from '../../../assets/bottom-bar/attach.svg';
import {
  ALLOWED_IMAGE_TYPE_FORMAT,
  AUDIO_TYPE_FORMAT,
  FILE_TYPE_FORMAT,
} from '../../../constant/infoTooltipMessages';

import dateFormatter from '../../../utils/chat/dateFormatter';

import style from './searchMessageItem.module.scss';

interface PSeachMessageItem {
  m: MessageListItem;
  userUid: string;
}

const SearchMessageItem: FC<PSeachMessageItem> = ({ m, userUid }) => {
  // const type = m.from_user.uid === userUid ? 'send' : 'get';
  const avatarU = useMemo(() => {
    const u =
      m.from_user.uid === userUid
        ? m.from_user.avatar_webp_url || m.from_user.avatar_url
        : m.to_user.avatar_webp_url || m.to_user.avatar_url;
    if (u) return u;
    return avatar;
  }, [m]);

  const nameUs = useMemo(() => {
    if (userUid === m.from_user.uid && userUid === m.to_user.uid)
      return 'Избранное (Вы)';

    const nu =
      m.from_user.uid === userUid
        ? `${m.from_user.last_name} ${m.from_user.first_name}`
        : `${m.to_user.last_name} ${m.to_user.first_name}`;

    if (nu) return nu;

    return 'Пользователь';
  }, [m]);

  const fileList = useMemo(() => {
    if (m.files_list.length > 0) {
      if (FILE_TYPE_FORMAT.includes(m.files_list[0].file_type || '')) {
        return (
          <div style={{ display: 'flex' }}>
            <span>файл(-ы)</span> <AttachSvg height={20} />
          </div>
        );
      }

      if (ALLOWED_IMAGE_TYPE_FORMAT.includes(m.files_list[0].file_type || '')) {
        return (
          <div>
            {m.files_list.map((i) => {
              return (
                <img
                  alt="foto"
                  src={i.file_webp_url || i.file_url}
                  key={i.id}
                  height={30}
                  width={30}
                  style={{ borderRadius: '5px' }}
                />
              );
            })}
          </div>
        );
      }

      if (AUDIO_TYPE_FORMAT.includes(m.files_list[0].file_type || '')) {
        return (
          <div style={{ display: 'flex' }}>
            <span>аудио</span> <AttachSvg height={20} />
          </div>
        );
      }
    }

    return null;
  }, [m]);

  return (
    <div className={classNames(style.message_wrapper)}>
      <div className={style.wrapperAvatar}>
        <Avatar
          img={avatarU}
          size="small"
          extraClassName={style.chatItemAvatar}
        />
      </div>

      <div className={style.content}>
        <h3 className={style.name} title={nameUs}>
          {nameUs}
        </h3>
        <div className={style.message}>
          {fileList}
          <span>Текст:</span>
          <Interweave content={m.content} />
        </div>
      </div>

      <div className={style.date}>{dateFormatter(m.created_at)}</div>
    </div>
  );
};

export default SearchMessageItem;

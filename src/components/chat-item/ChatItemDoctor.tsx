/* eslint-disable @typescript-eslint/naming-convention */
import { forwardRef } from 'react';

import textClamper from '../../utils/chat/textClamper';

import { DoctorInfo } from '../../types/doctor/doctor';
import Avatar from '../avatar/Avatar';

import style from './ChatItem.module.scss';

interface Props {
  doctor: DoctorInfo;
  handleChatItemDoctorClick: () => void;
}

const ChatItemDoctor = forwardRef<HTMLDivElement, Props>(
  ({ doctor, handleChatItemDoctorClick }, ref) => {
    const {
      first_name,
      last_name,
      patronymic,
      avatar,
      avatar_webp,
      specialization,
    } = doctor;
    return (
      <div
        ref={ref}
        className={style.chatItem}
        onClick={handleChatItemDoctorClick}
      >
        <Avatar
          img={avatar_webp || avatar}
          size="medium"
          extraClassName={style.chatItemAvatar}
        />
        <div className={style.content}>
          <h3 className={style.name} title={`${first_name} ${last_name}`}>
            {textClamper(`${last_name} ${first_name} ${patronymic}`, 21)}
          </h3>
          <p className={style.message}>
            {specialization[0]?.name || 'Специализация не указана'}
          </p>
        </div>
      </div>
    );
  }
);

export default ChatItemDoctor;

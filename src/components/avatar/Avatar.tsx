import classNames from 'classnames';
import { FC, memo } from 'react';

import avatar from '../../assets/side-menu/avatar.svg';

import style from './avatar.module.scss';

type Props = {
  img: string | null | undefined;
  size?: 'large' | 'small' | 'medium';
  extraClassName?: string;
};

const Avatar: FC<Props> = ({ img, size, extraClassName }) => {
  return (
    <div
      className={classNames(
        style.avatar,
        (size === 'large' || size === 'medium' || size === 'small') &&
          style.avatar_small,
        extraClassName
      )}
    >
      <img
        alt="Аватар"
        src={img || avatar}
        onError={({ currentTarget }) => {
          currentTarget.onerror = null;
          currentTarget.src = avatar;
        }}
        className={classNames(
          style.img,
          size === 'large' && style.img_large,
          size === 'medium' && style.img_medium,
          size === 'small' && style.img_small
        )}
      />
    </div>
  );
};

export default memo(Avatar);

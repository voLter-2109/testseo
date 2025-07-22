import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { FC, useRef, useState } from 'react';

import { addUserAvatar } from '../../api/user/user';
import { IUserProfile } from '../../types/user/user';
import Avatar from '../avatar/Avatar';

import {
  FILE_SIZE_ERROR_MESSAGE_10,
  IMAGE_FORMAT_FOR_AVATAR,
} from '../../constant/infoTooltipMessages';

import {
  QKEY_CHANGE_AVATAR,
  QKEY_GET_USER,
} from '../../constant/querykeyConstants';

import style from './avatarChangeBlock.module.scss';

type Props = {
  user: IUserProfile | null;
};

const AvatarChangeBlock: FC<Props> = ({ user }) => {
  const queryClient = useQueryClient();
  const formRef = useRef<HTMLFormElement>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { mutate } = useMutation({
    mutationKey: [QKEY_CHANGE_AVATAR],
    mutationFn: (file: File) => {
      return addUserAvatar(file);
    },
    onSuccess: () => {
      setErrorMessage(null);
      queryClient.invalidateQueries({ queryKey: [QKEY_GET_USER] });
    },
    onError: (error: AxiosError) => {
      console.log(error.response?.data);
      if (
        error.response?.data &&
        typeof error.response?.data === 'object' &&
        'file' in error.response.data
      ) {
        const fileError = error.response?.data.file as string[];
        setErrorMessage(`${fileError[0]}`);
      } else {
        setErrorMessage(error.message);
      }
    },
  });

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (
      e.target.files !== null &&
      e.target.files.length > 0 &&
      /^image\/.+/.test(e.target.files[0].type)
    ) {
      if (e.target.files[0].size / 1024 / 1024 > 10) {
        setErrorMessage(FILE_SIZE_ERROR_MESSAGE_10);
      } else mutate(e.target.files[0]);
    }
  };

  return (
    <>
      <Avatar img={user?.avatar_webp_url || user?.avatar_url} />
      <form className={style.form} encType="multipart/form-data" ref={formRef}>
        <label htmlFor="avatar_input">
          Изменить фото
          <input
            id="avatar_input"
            type="file"
            accept={IMAGE_FORMAT_FOR_AVATAR.join()}
            onChange={handleAvatarChange}
          />
        </label>
        {errorMessage && <p className={style.error}>{errorMessage}</p>}
      </form>
    </>
  );
};

export default AvatarChangeBlock;

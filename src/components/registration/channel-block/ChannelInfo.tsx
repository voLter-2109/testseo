import { FC, memo, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import CustomButton from '../../../ui/custom-button/Button';

import useYapErrorMessage from '../../../hooks/useYapErrorMessage';
import {
  CreateChannelForm,
  NameCreateChannelForm,
} from '../../../types/channel/createForm';

import {
  ALLOWED_CHANEL_IMAGE_TYPE_FORMAT,
  REQUIRED_TEXT,
} from '../../../constant/infoTooltipMessages';
import InputErrorMessage from '../../../ui/inputs/error-message/InputErrorMessage';
import Label from '../../../ui/inputs/label/Label';
import Input from '../../../ui/inputs/main-input/MainInput';
import Avatar from '../../avatar/Avatar';

import style from './channelInfo.module.scss';

type TChannelInfoProps = {
  setTrigger: () => void;
  onClose: () => void;
  defForm: CreateChannelForm;
  handleChangeDataForm: (d: CreateChannelForm) => void;
  loading?: boolean;
  error?: string | null;
};

const ChannelInfo: FC<TChannelInfoProps> = ({
  setTrigger,
  onClose,
  defForm,
  handleChangeDataForm,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    clearErrors,
    setError,
  } = useForm<CreateChannelForm>({
    reValidateMode: 'onSubmit',
    mode: 'onSubmit',
    defaultValues: defForm,
  });

  const onSubmit = (data: CreateChannelForm) => {
    handleChangeDataForm(data);
    setTrigger();
  };

  const errorMessageName = useYapErrorMessage(
    errors,
    NameCreateChannelForm.NAME
  );
  const errorMessageAvatar = useYapErrorMessage(
    errors,
    NameCreateChannelForm.AVATAR
  );

  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);

  const avatarFile = watch(NameCreateChannelForm.AVATAR);

  useEffect(() => {
    if (avatarFile && avatarFile?.[0]) {
      const file = avatarFile[0];
      const objectUrl = URL.createObjectURL(file);
      setPreviewAvatar(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    }

    return setPreviewAvatar(null);
  }, [avatarFile]);

  return (
    <form
      onSubmit={handleSubmit((data) => {
        onSubmit(data);
      })}
    >
      <div className={style.formContainer}>
        <div className={style.changeAvatar}>
          <Avatar
            img={
              previewAvatar ||
              (defForm.newAvatarUrl && typeof defForm.newAvatarUrl === 'string'
                ? defForm.newAvatarUrl
                : null)
            }
          />

          <label htmlFor={NameCreateChannelForm.AVATAR}>
            Изменить фото
            <input
              id={NameCreateChannelForm.AVATAR}
              type="file"
              {...register(NameCreateChannelForm.AVATAR, {
                onChange: (e) => {
                  clearErrors(NameCreateChannelForm.AVATAR);
                  const { files } = e.target;
                  if (files && files[0]) {
                    if (
                      !ALLOWED_CHANEL_IMAGE_TYPE_FORMAT.includes(files[0].type)
                    ) {
                      setValue(NameCreateChannelForm.AVATAR, null);
                      return setError(NameCreateChannelForm.AVATAR, {
                        message: 'Допустимые форматы: jpg/bmp/png',
                        type: 'error',
                      });
                    }

                    // Проверка размера
                    if (files[0].size > 5000000) {
                      setValue(NameCreateChannelForm.AVATAR, null);
                      return setError(NameCreateChannelForm.AVATAR, {
                        message: 'Максимальный размер файла: 5MB',
                        type: 'error',
                      });
                    }

                    return e;
                  }

                  return null;
                },
              })}
              accept={ALLOWED_CHANEL_IMAGE_TYPE_FORMAT.join()}
            />
          </label>
          {errorMessageAvatar && (
            <InputErrorMessage errorMessage={errorMessageAvatar} />
          )}
        </div>

        <Input
          registerOptions={register(NameCreateChannelForm.NAME, {
            required: REQUIRED_TEXT,
            minLength: {
              value: 3,
              message: 'Введено менее 3 символов',
            },
            maxLength: {
              value: 100,
              message: 'Введено более 100 символов',
            },
          })}
          labelText="Название:"
          requiredLabel
          errorMessage={errorMessageName}
          name={NameCreateChannelForm.NAME}
          type="text"
          id={NameCreateChannelForm.NAME}
        />
        <div className={style.conditionsWrapper}>
          <label
            htmlFor={NameCreateChannelForm.PRIVATECHANEL}
            className={style.check}
          >
            <input
              type="checkbox"
              {...register(NameCreateChannelForm.PRIVATECHANEL)}
              name={NameCreateChannelForm.PRIVATECHANEL}
              id={NameCreateChannelForm.PRIVATECHANEL}
              className={`${style.check_input}`}
            />
            <span className={style.checkbox} />
          </label>
          <div className={style.conditions}>сделать приватным?</div>
        </div>

        <div className={style.wrapperTextArea}>
          <Label label="Описание:" />
          <div className={style.wrapperInput}>
            <textarea
              className={style.textarea}
              id={NameCreateChannelForm.DESC}
              rows={4}
              {...register(NameCreateChannelForm.DESC, {
                maxLength: {
                  value: 1000,
                  message: 'Введено более 1000 символов',
                },
              })}
            />
          </div>
        </div>

        <div className={style.controls}>
          <CustomButton
            type="button"
            textBtn="Отмена"
            classNameBtn={style.cancel}
            styleBtn="primary"
            onClick={onClose}
          />
          <CustomButton
            type="submit"
            textBtn="Далее"
            classNameBtn={style.ok}
            styleBtn="secondary"
          />
        </div>
      </div>
    </form>
  );
};

export default memo(ChannelInfo);

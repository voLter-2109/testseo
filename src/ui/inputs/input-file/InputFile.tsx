import classNames from 'classnames';
import React, {
  ChangeEvent,
  FC,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useFormContext } from 'react-hook-form';

import { ReactComponent as Like } from '../../../assets/create-profile/like.svg';
import {
  FILE_FORMAT_ERROR_MESSAGE,
  FILE_FORMAT_FOR_DIPLOMA_SUCCESS,
  FILE_SIZE_ERROR_MESSAGE_20,
  REQUIRED_TEXT,
} from '../../../constant/infoTooltipMessages';
import useYapErrorMessage from '../../../hooks/useYapErrorMessage';
import ClearFieldBtn from '../clear-filed-btn/ClearFieldBtn';
import InputErrorMessage from '../error-message/InputErrorMessage';
import Label from '../label/Label';

import {
  MAX_SIZE_FILE,
  MIN_SIZE_FILE,
} from '../../../constant/other-constants';

import { IDefaultFormProps } from '../../../components/form/test.type';

import style from './inputFile.module.scss';

interface IInputFile extends React.InputHTMLAttributes<HTMLInputElement> {
  name:
    | `specialization.specialization.${number}.new_file`
    | 'diploma.diplomaNew';
  label?: string;
  requiredLabel?: boolean;
  disableOptions?: boolean;
  checkInputRequiredForSpec?: boolean;
  oldFile?: 'diploma.diploma.0';
}

const InputFile: FC<IInputFile> = ({
  name,
  label,
  oldFile,
  requiredLabel,
  disableOptions,
  checkInputRequiredForSpec,
  ...InputHTMLAttribute
}) => {
  const {
    setError,
    setValue,
    trigger,
    register,
    getValues,
    resetField,
    unregister,
    clearErrors,
    formState: { errors },
  } = useFormContext<IDefaultFormProps>();

  const [resetViewBtn, setResetViewBtn] = useState(false);
  const errorMessage = useYapErrorMessage(errors, name);
  const fileR = oldFile && getValues(oldFile);

  const inputFile = useRef<HTMLInputElement>(null);

  const handleResetVale = (err: boolean, textError: string = REQUIRED_TEXT) => {
    console.log(2);
    resetField(name);
    // if (inputFile.current) {
    //   inputFile.current.type = 'text';
    //   inputFile.current.value = '';
    //   inputFile.current.type = 'file';
    //   inputFile.current.files = null;
    // }

    if (!fileR && err) {
      setError(name, {
        type: 'required',
        message: textError,
      });
    }
    setResetViewBtn(false);
    setValue(name, null);
    trigger();
  };

  useEffect(() => {
    return () => {
      unregister(name, { keepIsValid: true });
    };
  }, []);

  const isInputValue = useMemo(
    () => resetViewBtn || Boolean(inputFile.current?.files?.length),
    [resetViewBtn, inputFile.current?.files?.length]
  );

  if (disableOptions) return null;

  return (
    <div className={style.wrapper}>
      {label && <Label label={label} required={requiredLabel} />}

      <div
        className={classNames(style.wrapperInput, {
          [style.error]: errorMessage,
        })}
      >
        <>
          <input
            title="select file"
            id={name}
            disabled={disableOptions}
            {...register(name, {
              required:
                checkInputRequiredForSpec || fileR ? false : REQUIRED_TEXT,
              // fileR || requiredLabel ? REQUIRED_TEXT : false,
              onChange(e: ChangeEvent<HTMLInputElement>) {
                if (!e.target.files || e.target.files.length === 0) {
                  return handleResetVale(
                    true,
                    'Ошибка: выберите хотя бы один файл.'
                  );
                }

                if (
                  (e.target.files && e.target.files[0].size > MAX_SIZE_FILE) ||
                  (e.target.files && e.target.files[0].size < MIN_SIZE_FILE)
                ) {
                  return handleResetVale(true, FILE_SIZE_ERROR_MESSAGE_20);
                }

                if (
                  e.target.files &&
                  !FILE_FORMAT_FOR_DIPLOMA_SUCCESS.includes(
                    e.target.files[0].type
                  )
                ) {
                  return handleResetVale(true, FILE_FORMAT_ERROR_MESSAGE);
                }

                if (e.target.files && e.target.files[0]) {
                  console.log(e.target.files[0]);
                  clearErrors(name);
                  setResetViewBtn(true);
                  return e;
                  // return setValue(name, e.target.files[0]);
                }

                if (oldFile && e.target.files && !e.target.files[0]) {
                  return handleResetVale(false);
                }

                return handleResetVale(true);
              },
            })}
            {...InputHTMLAttribute}
            type="file"
            className={style.input}
          />

          <div className={classNames(style.after)}>
            {!disableOptions && isInputValue && (
              <ClearFieldBtn
                onClick={() => {
                  if (oldFile) {
                    return handleResetVale(false);
                  }

                  return handleResetVale(true);
                }}
              />
            )}
          </div>
        </>
      </div>

      {errorMessage ? (
        <InputErrorMessage errorMessage={errorMessage} />
      ) : (
        <div className={style.errorMessage} />
      )}
      {fileR && fileR.file && (
        <div className={style.oldFile}>
          <p
            className={classNames({
              [style.noModerate]: fileR.is_moderated,
            })}
          >
            <Like
              className={classNames(style.moderate)}
              title="модерация пройдена"
            />
          </p>
          <a
            className={(style.moderate, style.click)}
            href={fileR.file_url}
            target="_blank"
            rel="noreferrer"
          >
            {oldFile &&
              Boolean(typeof fileR.file === 'string') &&
              fileR.file.replace(
                /(diplomas\/|specializations_certificates\/)/g,
                ''
              )}
          </a>
        </div>
      )}
    </div>
  );
};

export default InputFile;

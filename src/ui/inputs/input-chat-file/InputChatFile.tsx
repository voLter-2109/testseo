import React, { ChangeEvent, FC } from 'react';

import style from './InputChatFile.module.scss';

interface InputChatFileProps {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  fileRef: React.RefObject<HTMLInputElement>;
  fileType: string;
}

const InputChatFile: FC<InputChatFileProps> = ({
  onChange,
  fileRef,
  fileType,
}) => {
  return (
    <input
      type="file"
      className={style.attachment}
      name="attachment"
      id="attachment"
      ref={fileRef}
      onChange={onChange}
      accept={fileType}
      multiple
      style={{ display: 'none' }}
    />
  );
};

export default InputChatFile;

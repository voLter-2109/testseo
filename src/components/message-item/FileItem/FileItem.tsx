import { FC } from 'react';

import { ReactComponent as FileSvg } from '../../../assets/file-item/file.svg';
import convertFileSize from '../../../utils/chat/convertFileSize';

import style from './FileItem.module.scss';

interface FileItemProps {
  fileName: string;
  fileSize: number;
  fileImageSrc?: string | null;
}

const FileItem: FC<FileItemProps> = ({ fileName, fileSize, fileImageSrc }) => {
  return (
    <div className={style.fileItem}>
      {fileImageSrc ? (
        <div className={style.imgContainer}>
          <img src={fileImageSrc} alt="Предварительный просмотр" />
        </div>
      ) : (
        <div className={style.icon}>
          <FileSvg />
        </div>
      )}
      <div className={style.info}>
        <p className={style.name}>{fileName}</p>
        <div className={style.size}>{convertFileSize(fileSize)}</div>
      </div>
    </div>
  );
};

export default FileItem;

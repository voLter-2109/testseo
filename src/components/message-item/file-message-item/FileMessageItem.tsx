import { forwardRef } from 'react';

import { ReactComponent as FileSvg } from '../../../assets/file-item/file.svg';
import { FilesList } from '../../../types/chat/messageListItem';

import getFileName from '../../../utils/getFileNames';

import style from './fileMessage.module.scss';

interface Props {
  item: FilesList;
}

const FileMessageItem = forwardRef<HTMLDivElement, Props>(({ item }, ref) => {
  return (
    <div ref={ref} key={item.id} className={style.fileWrapper}>
      <a
        href={item.file_url}
        title={item.file}
        download={item.file}
        target="_blank"
        rel="noreferrer"
        className={style.fileUrl}
      >
        <div className={style.icon}>
          <FileSvg />
        </div>
        <div>{getFileName(item.file)}</div>
      </a>
    </div>
  );
});

export default FileMessageItem;

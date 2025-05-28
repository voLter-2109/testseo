import { forwardRef, useRef } from 'react';

import { FilesList } from '../../../types/chat/messageListItem';

import Divider from '../../../ui/divider/Divider';
import getFileName from '../../../utils/getFileNames';
import style from './audioMessageItem.module.scss';

interface Props {
  item: FilesList;
  attach?: boolean;
  isAttach?: boolean;
}

const AudioMessageItem = forwardRef<HTMLDivElement, Props>(
  ({ item, attach = false, isAttach = false }, ref) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const stopAudioHandler = useRef(() => {
      audioRef.current?.pause();
    });

    if (!attach && isAttach) stopAudioHandler.current();

    return (
      <div ref={ref} className={style.audioWrapper} key={item.id}>
        <div>{getFileName(item.file)}</div>
        <audio src={item.file_url} preload="metadata" controls ref={audioRef}>
          <track kind="captions" />
        </audio>
        {isAttach && <Divider />}
      </div>
    );
  }
);

export default AudioMessageItem;

/* eslint-disable jsx-a11y/media-has-caption */
import { forwardRef, useEffect, useRef, useState } from 'react';

import { FilesList } from '../../../types/chat/messageListItem';
import Divider from '../../../ui/divider/Divider';
import WaveserferComponent from '../../wavesurfe/Waveserfer';

import style from './audioMessageItem.module.scss';

interface Props {
  item: FilesList;
  attach?: boolean;
  isAttach?: boolean;
}

const AudioMessageItemTest = forwardRef<HTMLDivElement, Props>(
  ({ item, attach = false, isAttach = false }, ref) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    // скачанный файл
    const [fileResponse, setFileResponse] = useState<string | null>(null);
    // триггер для audio api
    const [isBlob, setIsBlob] = useState(false);

    // триггер проверки
    const [triggerLoadOff, setTriggerLoadOff] = useState(false);

    useEffect(() => {
      let abortController: AbortController;

      // функция для загрузки файла
      const loadFile = async () => {
        try {
          abortController = new AbortController();

          // Проверка доступности CORS
          const corsCheck = await fetch(item.file_url, {
            method: 'HEAD',
            mode: 'cors',
            signal: abortController.signal,
          });

          if (!corsCheck.ok) {
            setFileResponse(null);
            throw new Error('CORS error');
          }

          // Полная загрузка файла
          const response = await fetch(item.file_url, {
            signal: abortController.signal,
          });
          const blob = await response.blob();
          const objectURL = URL.createObjectURL(blob);

          setFileResponse(objectURL);
          setTriggerLoadOff(true);
        } catch (error) {
          setFileResponse(null);
        }
      };

      // проверяем что файл не с бека а из кеша
      const testBlobFile = item.file_url.startsWith('blob:');
      // если из кеша ( true), то загрузку не вызываем а вызываем триггер
      setIsBlob(testBlobFile);

      if (!testBlobFile) {
        loadFile();
      } else {
        setTriggerLoadOff(true);
      }

      return () => {
        abortController?.abort();
      };
    }, [item.file_url]);

    // Остановка воспроизведения при изменении вложений
    useEffect(() => {
      if (!attach && isAttach) {
        audioRef.current?.pause();
      }
    }, [attach, isAttach]);

    if (!triggerLoadOff) {
      return (
        <div className={style.audioError}>
          <p>Загрузка аудио сообщения</p>
        </div>
      );
    }

    if (fileResponse) {
      return (
        <div ref={ref} className={style.audioWrapper} key={item.id}>
          <WaveserferComponent fileUrl={fileResponse} />
          {isAttach && <Divider />}
        </div>
      );
    }

    if (isBlob) {
      return (
        <div ref={ref} className={style.audioWrapper} key={item.id}>
          <WaveserferComponent fileUrl={item.file_url} />
          {isAttach && <Divider />}
        </div>
      );
    }

    return (
      <div className={style.audioWrapper}>
        <audio
          controls
          src={item.file_url}
          ref={audioRef}
          preload="metadata"
          className={style.fallbackAudio}
        />
        {isAttach && <Divider />}
      </div>
    );
  }
);

export default AudioMessageItemTest;

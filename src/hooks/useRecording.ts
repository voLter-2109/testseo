import { MutableRefObject, useEffect } from 'react';
import { useReactMediaRecorder } from 'react-media-recorder-2';

import { MIN_SIZE_AUDIO_FILE } from '../constant/other-constants';

const useRecording = (
  onSetStyleRecord: (prev: boolean | ((prev: boolean) => boolean)) => void,
  onSetTimerRecord: (prev: number | ((prev: number) => number)) => void,
  onSetBlobFile: (prev: File | null) => void,
  onSetBlobUrl: (prev: string | ((prev: string) => string)) => void,
  timeIntervalRef: MutableRefObject<ReturnType<typeof setInterval> | null>
) => {
  // удаляет все таймеры
  useEffect(() => {
    return () => clearInterval(timeIntervalRef.current as NodeJS.Timer);
  }, []);

  // функция для запуска таймера  во время записи
  const handleStartTimer = () => {
    const timeIntervalId = setInterval(
      () => onSetTimerRecord((prev) => prev + 1),
      1000
    );
    timeIntervalRef.current = timeIntervalId;
  };

  // функция для остановки таймера, во время записи аудио сообщения
  const handleStopTimer = () => {
    clearInterval(timeIntervalRef.current as NodeJS.Timer);
    timeIntervalRef.current = null;
  };

  const { startRecording, stopRecording, clearBlobUrl, status } =
    useReactMediaRecorder({
      audio: true,
      video: false,
      stopStreamsOnStop: true,
      onStart: () => {
        handleStartTimer();
        onSetStyleRecord(true);
      },

      // eslint-disable-next-line consistent-return
      onStop: (blobUrl: string, blob: Blob) => {
        handleStopTimer();
        onSetStyleRecord(false);

        if (blob.size <= MIN_SIZE_AUDIO_FILE) {
          onSetTimerRecord(0);
          onSetBlobFile(null);
          onSetBlobUrl('');
          return clearBlobUrl();
        }

        if (blob.size >= MIN_SIZE_AUDIO_FILE) {
          const fileName = blobUrl.replace(window.location.origin, '');
          const file = new File([blob], `${fileName}.mp3`);
          console.log(file);
          onSetBlobFile(file);
          onSetBlobUrl(blobUrl);
        }
      },
    });

  const resetRecord = () => {
    onSetTimerRecord(0);
    onSetBlobFile(null);
    onSetBlobUrl('');
    clearBlobUrl();
  };

  //  сброс всех записанных данных

  useEffect(() => {
    return () => resetRecord();
  }, []);

  return {
    startRecording,
    stopRecording,
    resetRecord,
    handleStopTimer,
    status,
  };
};

export default useRecording;

import { useWavesurfer } from '@wavesurfer/react';
import classNames from 'classnames';
import { FC, useCallback, useEffect, useRef, useState } from 'react';

import timerFormat from '../../utils/timerFormat';
import { ReactComponent as PauseIconBtn } from '../../assets/message/pause_icon.svg';
import { ReactComponent as PlayIconBtn } from '../../assets/message/play_icon.svg';

import style from './WaveSerfer.module.scss';

type Props = {
  fileUrl?: string;
  localFileUrl?: string;
  recordAudio?: boolean;
};

const WaveserferComponent: FC<Props> = ({
  fileUrl,
  localFileUrl = '',
  recordAudio = false,
}) => {
  const wavesurferRef = useRef<HTMLDivElement>(null);
  const sizeBlock = useRef<HTMLDivElement>(null);
  const [wavesurferUrl, setWaveserferUrl] = useState<string>('');
  const [durationAudio, setDurationTime] = useState<number>(0);

  useEffect(() => {
    if (localFileUrl) setWaveserferUrl(localFileUrl);

    if (fileUrl) setWaveserferUrl(fileUrl);
  }, []);

  useEffect(() => {
    if (localFileUrl) setWaveserferUrl(localFileUrl);
  }, [localFileUrl]);

  const chatWaveSerfer = {
    height: 20,
    barWidth: 3,
    barGap: 1,
    barRadius: 10,
  };

  const inputWaveSerfer = {
    height: 20,
    barWidth: 5,
    barGap: 1,
    barRadius: 10,
  };

  const { wavesurfer, isPlaying, currentTime, isReady } = useWavesurfer({
    container: wavesurferRef,
    ...(!recordAudio && chatWaveSerfer),
    ...(recordAudio && inputWaveSerfer),
    cursorWidth: 0,
    width: '100%',
    waveColor: '#5856d6',
    progressColor: '#2724a1',
    url: wavesurferUrl,
  });

  useEffect(() => {
    const time = wavesurfer?.getDecodedData()?.duration;
    if (time) setDurationTime(time);
  }, [isReady, wavesurfer]);

  const onPlayPause = useCallback(() => {
    if (wavesurfer) wavesurfer.playPause();
  }, [wavesurfer]);

  useEffect(() => {
    return wavesurfer?.destroy();
  }, []);

  return (
    <div className={style.waveserfer}>
      <button
        title="проиграть или остановить запись"
        aria-label="проиграть или остановить запись"
        className={style.playPause}
        type="button"
        onClick={onPlayPause}
      >
        <div className={style.pict}>
          {isPlaying ? <PauseIconBtn /> : <PlayIconBtn />}
        </div>
      </button>

      <div className={style.waveAndTime}>
        <div
          className={classNames(style.playerBlock, {
            [style.recordAudio]: recordAudio,
          })}
        >
          <div ref={sizeBlock} className={style.sizeBlock}>
            <div
              ref={wavesurferRef}
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        </div>

        <div className={style.timeInfo}>
          <time>{timerFormat(Math.floor(currentTime))}</time>
          <span> / </span>
          <time>{timerFormat(Math.floor(durationAudio))}</time>
        </div>
      </div>
    </div>
  );
};

export default WaveserferComponent;

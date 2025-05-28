import { useQueryClient } from '@tanstack/react-query';
import classNames from 'classnames';
import { FC, useState } from 'react';

import CustomButton from '../../ui/custom-button/Button';
import AttachmentsAudio from '../attachments-audio/AttachmentsAudio';
import AttachmentsFiles from '../attachments-files/AttachmentsFiles';
import AttachmentsImages from '../attachments-images/AttachmentsImages';

import style from './attachments.module.scss';

type Props = {
  uid: string;
  isOpen: boolean;
};

const Attachments: FC<Props> = ({ uid, isOpen }) => {
  const queryClient = useQueryClient();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [isFilesEnabled, setIsFilesEnabled] = useState(false);

  const resetInfiniteQueryPagination = (key: string[]) => {
    queryClient.setQueryData<
      | {
          pageParams: number[];
          pages: { data: any[] }[];
        }
      | undefined
    >(key, (oldData) => {
      if (!oldData) return undefined;

      return {
        pages: [oldData?.pages?.[0] ?? []],
        pageParams: [1],
      };
    });
    queryClient.invalidateQueries({ queryKey: key });
  };

  // ! задача убрать повторение запросов, а добавить дополнение кеша из приходяших сообщений
  const refreshImages = () => {
    const key = [`getImagesMessagesList: ${uid}`];
    resetInfiniteQueryPagination(key);
  };

  const refreshFiles = () => {
    const key = [`getFilesMessagesList: ${uid}`];
    resetInfiniteQueryPagination(key);
  };

  const refreshAudio = () => {
    const key = [`getAudioMessagesList: ${uid}`];
    resetInfiniteQueryPagination(key);
  };
  const slides = [
    {
      id: 1,
      content: 'Медиа',
      component: (
        <AttachmentsImages uid={uid} refresh={refreshImages} enabled={isOpen} />
      ),
    },
    {
      id: 2,
      content: 'Файлы',
      component: (
        <AttachmentsFiles
          uid={uid}
          refresh={refreshFiles}
          enabled={isFilesEnabled}
        />
      ),
    },
    {
      id: 3,
      content: 'Аудио',
      component: (
        <AttachmentsAudio
          uid={uid}
          refresh={refreshAudio}
          enabled={isAudioEnabled && isOpen}
        />
      ),
    },
  ];

  const goToSlide = (index: number) => {
    setIsAudioEnabled(false);
    setCurrentSlide(index);
    if (index === 0) {
      refreshImages();
    }
    if (index === 1) {
      refreshFiles();
      setIsFilesEnabled(true);
    }
    if (index === 2) {
      refreshAudio();
      setIsAudioEnabled(true);
    }
  };

  return (
    <div className={style.wrapper}>
      <div className={style.buttons}>
        {slides.map((slide, index) => (
          <CustomButton
            key={slide.id}
            styleBtn="blue"
            textBtn={slide.content}
            classNameBtn={classNames({
              [style.inactiveTitle]: currentSlide === index,
            })}
            type="button"
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
      <div
        className={style.slides}
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide) => (
          <div className={style.slide} key={slide.id}>
            {slide.component}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Attachments;

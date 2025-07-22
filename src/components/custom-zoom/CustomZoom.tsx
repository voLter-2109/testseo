import * as FileSaver from 'file-saver';
import { FC, useEffect, useRef, useState } from 'react';
import Slider, { Settings } from 'react-slick';

import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';

import { ReactComponent as ArrowLeft } from '../../assets/custom-zoom/arrowLeft.svg';
import { ReactComponent as ArrowRight } from '../../assets/custom-zoom/arrowRight.svg';
import { ReactComponent as DownloadIcon } from '../../assets/custom-zoom/download.svg';
import { ReactComponent as MobileArrowLeft } from '../../assets/custom-zoom/mobileArrowLeft.svg';
import { ReactComponent as MobileArrowRight } from '../../assets/custom-zoom/mobileArrowRight.svg';

import { FilesList } from '../../types/chat/chat';

import useWindowResize from '../../hooks/useWindowResize';
import getFileName from '../../utils/getFileNames';

import CrossBtn from '../../ui/cross-button/CrossBtn';

import style from './customZoom.module.scss';

interface PropsSlider {
  image: FilesList[];
  initSlide: number;
}

const CustomSlider: FC<PropsSlider> = ({ image, initSlide }) => {
  const [currentSlide, setCurrentSlide] = useState(initSlide || 0);
  const sliderRef = useRef<Slider>(null);
  const { isMobile } = useWindowResize();

  const settings: Settings = {
    initialSlide: initSlide || 0,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    infinite: true,
    arrows: false,
    afterChange: (current: number) => setCurrentSlide(current),
  };

  useEffect(() => {
    setCurrentSlide(initSlide || 0);
    sliderRef.current?.slickGoTo(initSlide || 0);
  }, [initSlide]);

  const handleDownload = async (
    e: React.MouseEvent,
    item: FilesList
  ): Promise<void> => {
    e.preventDefault();
    try {
      const response = await fetch(item.file_url);
      if (!response.ok) {
        throw new Error(`Ошибка загрузки: ${response.statusText}`);
      }
      const blob = await response.blob();
      FileSaver.saveAs(blob, item.file);
    } catch (error) {
      console.error('Ошибка при скачивании файла:', error);
      FileSaver.saveAs(item.file_url, item.file);
    }
  };
  return (
    <>
      <div className={style.wrapper}>
        {!isMobile && image.length > 1 && (
          <>
            <div
              className={style.arrowLeft}
              onClick={() => sliderRef.current?.slickPrev()}
            >
              <ArrowLeft />
            </div>
            <div
              className={style.arrowRight}
              onClick={() => sliderRef.current?.slickNext()}
            >
              <ArrowRight />
            </div>
          </>
        )}

        <div className={style.sliderContainer}>
          <Slider ref={sliderRef} {...settings} className="customSlide">
            {image.map((item: { id: any; file_url: any; file: any }) => (
              <div key={item.id}>
                <div className="img-body">
                  <img
                    style={{ objectFit: 'contain' }}
                    src={item.file_url}
                    alt={getFileName(item.file)}
                    height="95%"
                    width="100%"
                  />
                </div>
              </div>
            ))}
          </Slider>
          {isMobile && image.length > 1 && (
            <div className={style.mobileArrows}>
              <div onClick={() => sliderRef.current?.slickPrev()}>
                <MobileArrowLeft />
              </div>
              <div onClick={() => sliderRef.current?.slickNext()}>
                <MobileArrowRight />
              </div>
            </div>
          )}
          <div className={style.infoBar}>
            <span>
              {currentSlide + 1}/{image.length}
            </span>
            <span>{getFileName(image[currentSlide]?.file)}</span>
            <span onClick={(e: any) => handleDownload(e, image[currentSlide])}>
              <DownloadIcon />
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

interface PropsZoom extends PropsSlider {
  image: FilesList[];
  initSlide: number;
  handleToggleZoom: () => void;
}

const CustomZoom: FC<PropsZoom> = ({ handleToggleZoom, image, initSlide }) => {
  return (
    <>
      <div className={style.overlay} />
      <div className={style.wrapper}>
        <div className={style.btnClose}>
          <CrossBtn onClick={handleToggleZoom} />
        </div>
        <CustomSlider image={image} initSlide={initSlide} />
      </div>
    </>
  );
};

export default CustomZoom;

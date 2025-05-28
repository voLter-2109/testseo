import { FC, HTMLAttributes, useState } from 'react';
import Slider, { Settings } from 'react-slick';

import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';

import { ReactComponent as Cross } from '../../assets/create-profile/cross.svg';

import { FilesList } from '../../types/chat/chat';

import getFileName from '../../utils/getFileNames';

import style from './customZoom.module.scss';

interface PropsArrow extends HTMLAttributes<HTMLDivElement> {}

const SampleNextArrow: FC<PropsArrow> = (props) => {
  const { style: styleNextArrow, onClick } = props;
  return (
    <div
      className="customArrow"
      style={{
        ...styleNextArrow,
      }}
      onClick={onClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        stroke="black"
        height="24"
        viewBox="0 -960 960 960"
        width="24"
      >
        <path d="m242-200 200-280-200-280h98l200 280-200 280h-98Zm238 0 200-280-200-280h98l200 280-200 280h-98Z" />
      </svg>
    </div>
  );
};
const SamplePrevArrow: FC<PropsArrow> = (props) => {
  const { style: stylePrevArrow, onClick } = props;
  return (
    <div
      className="customArrow"
      style={{
        ...stylePrevArrow,
        rotate: '180deg',
      }}
      onClick={onClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        stroke="black"
        height="24"
        viewBox="0 -960 960 960"
        width="24"
      >
        <path d="m242-200 200-280-200-280h98l200 280-200 280h-98Zm238 0 200-280-200-280h98l200 280-200 280h-98Z" />
      </svg>
    </div>
  );
};

interface PropsSlider {
  image: FilesList[];
  initSlide: number;
}
const CustomSlider: FC<PropsSlider> = ({ image, initSlide }) => {
  const [currentSlide, setCurrentSlide] = useState(initSlide || 0);
  const settings: Settings = {
    initialSlide: initSlide || 0,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    infinite: true,
    autoplaySpeed: 5000,
    arrows: image.length > 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    afterChange: (current) => setCurrentSlide(current),
  };

  const handleDownload = (e: React.MouseEvent, item: FilesList) => {
    e.preventDefault();
    const link = document.createElement('a');
    link.href = item.file_url;
    link.download = item.file;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={style.sliderContainer}>
      <Slider {...settings} className="customSlide">
        {image.map((item) => {
          return (
            <div key={item.id}>
              <div className="img-body">
                <img
                  style={{
                    objectFit: 'contain',
                  }}
                  src={item.file_url}
                  alt={item.file}
                  height="95%"
                  width="100%"
                />
              </div>
            </div>
          );
        })}
      </Slider>
      <div className={style.infoBar}>
        <span>{getFileName(image[currentSlide]?.file)}</span>
        <span>
          {currentSlide + 1}/{image.length}
        </span>
        <span onClick={(e) => handleDownload(e, image[currentSlide])}>
          скачать
        </span>
      </div>
    </div>
  );
};

interface PropsZoom extends PropsSlider {
  handleToggleZoom: () => void;
  initSlide: number;
}

const CustomZoom: FC<PropsZoom> = ({ handleToggleZoom, image, initSlide }) => {
  return (
    <>
      <div className={style.btnClose}>
        <Cross onClick={handleToggleZoom} className={style.btn_svg} />
      </div>
      <CustomSlider image={image} initSlide={initSlide} />
    </>
  );
};

export default CustomZoom;

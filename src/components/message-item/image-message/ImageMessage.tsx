import { FC, memo, useState } from 'react';

import { FilesList } from '../../../types/chat/chat';
import ImageMessageItem from '../image-message-item/ImageMessageItem';
import TextMessage from '../text-message/TextMessage';

import ZoomWrapperImage from '../../zoom-wrapper-image/ZoomWrapperImage';

import style from './imageMessage.module.scss';

interface PropsImageMessage {
  fileList: FilesList[];
  content: string;
  isDeleted?: boolean;
}

const ImageMessage: FC<PropsImageMessage> = ({
  content,
  fileList,
  isDeleted = false,
}) => {
  const [showZoom, setShowZoom] = useState(false);
  const [initSlide, setInitSlide] = useState<number>(0);

  const handleToggleZoom = () => {
    setShowZoom((prev) => !prev);
  };

  if (fileList.length === 1 || fileList.length === 2) {
    return (
      <ZoomWrapperImage
        isOpen={showZoom}
        message={fileList}
        initSlide={initSlide}
        onClose={handleToggleZoom}
      >
        <div className={style.imageWrapper}>
          {fileList.map((item, index) => (
            <ImageMessageItem
              key={item.id}
              onClick={() => {
                setInitSlide(index);
                handleToggleZoom();
              }}
              item={item}
              data-element={index + 1}
            />
          ))}
        </div>
        {content.length > 0 && (
          <TextMessage content={content} isDeleted={isDeleted} />
        )}
      </ZoomWrapperImage>
    );
  }

  if (fileList.length === 3 || fileList.length === 4) {
    return (
      <ZoomWrapperImage
        isOpen={showZoom}
        initSlide={initSlide}
        message={fileList}
        onClose={handleToggleZoom}
      >
        <div className={style.imageWrapper}>
          <ImageMessageItem
            onClick={() => {
              setInitSlide(0);
              handleToggleZoom();
            }}
            key={fileList[0].id}
            item={fileList[0]}
          />
          <div>
            {fileList.map((item, index) => {
              if (index === 0) return null;

              return (
                <ImageMessageItem
                  onClick={() => {
                    setInitSlide(index);
                    handleToggleZoom();
                  }}
                  key={item.id}
                  item={item}
                  data-element={index + 1}
                />
              );
            })}
          </div>
        </div>
        {content.length > 0 && (
          <TextMessage content={content} isDeleted={isDeleted} />
        )}
      </ZoomWrapperImage>
    );
  }

  if (fileList.length === 5) {
    return (
      <ZoomWrapperImage
        isOpen={showZoom}
        message={fileList}
        initSlide={initSlide}
        onClose={handleToggleZoom}
      >
        <div className={style.imageWrapper}>
          <div>
            {fileList.map((item, index) => {
              if (index < 2) {
                return (
                  <ImageMessageItem
                    onClick={() => {
                      setInitSlide(index);
                      handleToggleZoom();
                    }}
                    key={item.id}
                    item={item}
                    data-element={index + 1}
                  />
                );
              }

              return null;
            })}
          </div>
          <div>
            {fileList.map((item, index) => {
              if (index >= 2) {
                return (
                  <ImageMessageItem
                    onClick={() => {
                      setInitSlide(index);
                      handleToggleZoom();
                    }}
                    key={item.id}
                    item={item}
                    data-element={index + 1}
                  />
                );
              }
              return null;
            })}
          </div>
        </div>
        {content.length > 0 && (
          <TextMessage content={content} isDeleted={isDeleted} />
        )}
      </ZoomWrapperImage>
    );
  }

  return (
    <ZoomWrapperImage
      isOpen={showZoom}
      message={fileList}
      initSlide={initSlide}
      onClose={handleToggleZoom}
    >
      <div className={style.imageWrapper}>
        {fileList.map((item, index) => (
          <ImageMessageItem
            onClick={() => {
              setInitSlide(index);
              handleToggleZoom();
            }}
            key={item.id}
            item={item}
            data-element={index + 1}
          />
        ))}
      </div>
      {content.length > 0 && (
        <TextMessage content={content} isDeleted={isDeleted} />
      )}
    </ZoomWrapperImage>
  );
};

export default memo(ImageMessage);

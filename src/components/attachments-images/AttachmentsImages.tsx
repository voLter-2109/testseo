import { FC, useCallback, useRef, useState } from 'react';

import useAttachmentsQueries from '../../api/use-infinite-query/use-attachments-queries/useAttachmentsQueries';
import RootBoundaryComponent from '../../ui/error-component/RootBoundaryComponent';
import OutletLoading from '../../ui/suspense-loading/OutletLoading';
import ImageMessageItem from '../message-item/image-message-item/ImageMessageItem';

import NoAttachments from '../attachments/NoAttachments';
import ZoomWrapperImage from '../zoom-wrapper-image/ZoomWrapperImage';

import style from './attachmentsImages.module.scss';

type AttachmentsItemProps = {
  uid: string;
  refresh: () => void;
  enabled: boolean;
};

const AttachmentsImages: FC<AttachmentsItemProps> = ({
  uid,
  refresh,
  enabled,
}) => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [showZoom, setShowZoom] = useState(false);
  const [initSlide, setInitSlide] = useState<number>(0);
  const handleToggleZoom = () => {
    setShowZoom((prev) => !prev);
  };

  const { imagesQuery } = useAttachmentsQueries({
    uid,
    isAudioEnabled: false,
    isFilesEnabled: false,
    isImageEnabled: enabled,
  });

  const {
    data: attachmentsImages,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isError,
  } = imagesQuery;

  const lastImageElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (!node || isLoading || !hasNextPage) return;

      observerRef.current?.disconnect();
      observerRef.current = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) fetchNextPage();
      });

      observerRef.current.observe(node);
    },
    [isLoading, hasNextPage, fetchNextPage]
  );

  if (isLoading) return <OutletLoading />;

  if (isError)
    return <RootBoundaryComponent refreshFunc={refresh} ariaTitle="обновить" />;

  if (!(attachmentsImages && attachmentsImages.length > 0))
    return (
      <div
        style={{
          height: '100%',
        }}
      >
        <NoAttachments />
      </div>
    );

  return (
    <div className={style.container}>
      <ZoomWrapperImage
        isOpen={showZoom}
        message={attachmentsImages}
        initSlide={initSlide}
        onClose={handleToggleZoom}
      >
        {attachmentsImages && attachmentsImages.length > 0 ? (
          attachmentsImages.map((item, index: number) => (
            <ImageMessageItem
              onClick={() => {
                setInitSlide(index);
                handleToggleZoom();
              }}
              key={item.id}
              item={item}
              ref={
                index === attachmentsImages.length - 1
                  ? lastImageElementRef
                  : null
              }
            />
          ))
        ) : (
          <NoAttachments />
        )}
      </ZoomWrapperImage>
    </div>
  );
};

export default AttachmentsImages;

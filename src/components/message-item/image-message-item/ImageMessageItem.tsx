import { forwardRef, ImgHTMLAttributes, useMemo } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import { FilesList } from '../../../types/chat/chat';

import styles from './imageMessageItem.module.scss';

interface Props extends ImgHTMLAttributes<HTMLImageElement> {
  item: FilesList;
}

const ImageMessageItem = forwardRef<HTMLDivElement, Props>(
  ({ item, ...atr }, ref) => {
    const fileName = useMemo(() => {
      const name = item.file.split('/');
      return name[name.length - 1];
    }, [item]);

    return (
      <div ref={ref} key={item.id} {...atr} className={styles.imageContainer}>
        <LazyLoadImage
          style={{ objectFit: 'cover', width: '100%' }}
          height="100px"
          wrapperClassName={styles.lazyClass}
          alt={fileName}
          effect="blur"
          src={item.file_webp_url || item.file_url}
        />
      </div>
    );
  }
);

export default ImageMessageItem;

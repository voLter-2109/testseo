import { FC, PropsWithChildren } from 'react';

import { FilesList } from '../../types/chat/chat';
import Popup from '../../ui/popup/Popup';
import CustomZoom from '../custom-zoom/CustomZoom';

type PropsWrapperImage = {
  isOpen: boolean;
  initSlide: number;
  onClose: () => void;
  message: FilesList[];
};

const ZoomWrapperImage: FC<PropsWithChildren<PropsWrapperImage>> = ({
  isOpen,
  message,
  onClose,
  children,
  initSlide,
}) => {
  return (
    <div>
      {children}
      {isOpen && (
        <Popup isOpen={isOpen} onClose={onClose}>
          <CustomZoom
            handleToggleZoom={onClose}
            image={message}
            initSlide={initSlide}
          />
        </Popup>
      )}
    </div>
  );
};

export default ZoomWrapperImage;

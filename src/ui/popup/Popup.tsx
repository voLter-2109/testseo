import { FC, useEffect } from 'react';
import { Portal } from 'react-portal';

import classNames from 'classnames';

import style from './Popup.module.scss';

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  extraClass?: string;
}

const Popup: FC<PopupProps> = ({ isOpen, onClose, children, extraClass }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };

    const originalStyle = window.getComputedStyle(document.body).overflow;

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = originalStyle;
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalStyle;
    };
  }, [isOpen]);

  return (
    <Portal>
      <div
        className={classNames(style.layout, isOpen && style.layout_show)}
        onClick={onClose}
      >
        <div
          className={classNames(style.content, extraClass)}
          onClick={(event) => {
            event.stopPropagation();
          }}
        >
          {children}
        </div>
      </div>
    </Portal>
  );
};

export default Popup;

import { useEffect, RefObject } from 'react';

function useOutsideClick<T extends HTMLElement>(
  ref: RefObject<T>,
  onAction: () => void
) {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onAction();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onAction]);

  return ref;
}

export default useOutsideClick;

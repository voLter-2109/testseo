import { RefObject, useEffect, useRef } from 'react';

function useQuillRightClick<T extends HTMLDivElement>(
  quillRef: RefObject<T>,
  quillMenuRef: RefObject<T>,
  setQuillMenuIsShowing: (state: boolean) => void,
  value: string
) {
  const valueRef = useRef(value);

  const getPosition = (ev: MouseEvent) => {
    let posx = 0;
    let posy = 0;
    const node = ev.target as HTMLElement;
    if (node) {
      posx = ev.offsetX;
      posy = ev.offsetY;
    }
    return {
      x: posx,
      y: posy,
    };
  };

  const handleClick = (ev: MouseEvent) => {
    const raw = valueRef.current || '';
    const isEmpty =
      raw
        .replace(/<(.|\n)*?>/g, '')
        .replace(/&nbsp;/g, '')
        .trim() === '';

    if (
      !isEmpty &&
      ev.button === 2 &&
      quillRef.current?.contains(ev.target as HTMLElement)
    ) {
      ev.preventDefault();
      setQuillMenuIsShowing(true);
      const clickPosition = getPosition(ev);
      const clickPositionX = `${clickPosition.x + 100}px`;
      const clickPositionY = `${60 - clickPosition.y}px`;
      if (quillMenuRef.current) {
        quillMenuRef.current.style.left = clickPositionX;
        quillMenuRef.current.style.bottom = clickPositionY;
      }
    }
  };

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  useEffect(() => {
    document.addEventListener('contextmenu', handleClick);

    return () => {
      document.removeEventListener('contextmenu', handleClick);
    };
  }, []);

  useEffect(() => {
    document.addEventListener('mouseup', (ev: MouseEvent) =>
      ev.preventDefault()
    );

    return () => {
      document.removeEventListener('mouseup', (ev: MouseEvent) =>
        ev.preventDefault()
      );
    };
  }, []);
}

export default useQuillRightClick;

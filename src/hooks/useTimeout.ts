import { useEffect, useRef } from 'react';
import { useIsomorphicLayoutEffect } from './useEventListener';

const useTimeout = (callback: () => void, delay: number): void => {
  const savedCallback = useRef(callback);

  useIsomorphicLayoutEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const id = setTimeout(() => {
      savedCallback.current();
    }, delay);

    return () => {
      clearTimeout(id);
    };
  }, [delay]);
};

export default useTimeout;

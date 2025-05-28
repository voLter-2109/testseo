import { useEffect, useRef } from 'react';

/**
 * @description запускает функцию при размонтировании компонента
 * @param func callback
 *
 * @example
 * import { useUnmount } from '...'

  export default function Component() {
  useUnmount(() => {
    // Cleanup logic here
  })

  return <div>Hello world</div>
}
 */
function useUnmount(func: () => void) {
  const funcRef = useRef(func);

  funcRef.current = func;

  useEffect(
    () => () => {
      funcRef.current();
    },
    []
  );
}

export default useUnmount;

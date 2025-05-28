import { useEffect, useMemo, useRef } from 'react';

import debounce from 'lodash.debounce';

import useUnmount from './useUnmount';

/**
 * maxWait - количество времени ожидания перед вызовом функции.

throttle - количество времени ожидания между вызовами.

throttle используется, когда вы вызываете функцию несколько раз и не
хотите, чтобы она вызывалась слишком часто. maxWait используется, когда вы откладываете выполнение одного события.
 */
type DebounceOptions = {
  leading?: boolean;
  trailing?: boolean;
  maxWait?: number;
};

type ControlFunctions = {
  cancel: () => void;
  flush: () => void;
  isPending: () => boolean;
};

export type DebouncedState<T extends (...args: any) => ReturnType<T>> = ((
  ...args: Parameters<T>
) => ReturnType<T> | undefined) &
  ControlFunctions;

/**
 *
 * @param func функция
 * @param delay задержка
 * @param options -описание внутри файл с приложенной ссылкой
 * @returns
 */
export function useDebounceCallback<T extends (...args: any) => ReturnType<T>>(
  func: T,
  delay = 500,
  options?: DebounceOptions
): DebouncedState<T> {
  const debouncedFunc = useRef<ReturnType<typeof debounce>>();

  useUnmount(() => {
    if (debouncedFunc.current) {
      debouncedFunc.current.cancel();
    }
  });

  const debounced = useMemo(() => {
    const debouncedFuncInstance = debounce(func, delay, options);

    const wrappedFunc: DebouncedState<T> = (...args: Parameters<T>) => {
      return debouncedFuncInstance(...args);
    };

    wrappedFunc.cancel = () => {
      debouncedFuncInstance.cancel();
    };

    wrappedFunc.isPending = () => {
      return !!debouncedFunc.current;
    };

    wrappedFunc.flush = () => {
      return debouncedFuncInstance.flush();
    };

    return wrappedFunc;
  }, [func, delay, options]);

  // Update the debounced function ref whenever func, wait, or options change
  useEffect(() => {
    debouncedFunc.current = debounce(func, delay, options);
  }, [func, delay, options]);

  return debounced;
}

/**
 * Параметры функции
 * debounce(func, [time], [options])

func - функция, которую необходимо обернуть
time - время в миллисекундах до следующего вызова
options - набор дополнительных параметров в виде объекта

[options.leading] (boolean, false по-умолчанию) - если true, то разрешает запуск функции моментально, не дожидаясь выставленного в параметре time времени. Последующие вызовы будут отклоняться до тех пор пока не пройдёт заданное время. По истечению будет запущен последний вызов функции.

[options.maxWait] (number) - максимальное время которое функция не будет вызываться при её многократном вызове. Дело в том, что если функция будет вызываться чаще, заданного времени в параметре time, то таймер будет каждый раз сбрасываться и наша функция не будет выполнена до тех пор, пока на протяжении n времени её не будут трогать. Если мы задаём этот параметр, то когда истечёт заданное в нём время, функция будет принудительно вызвана.

[options.trailing] (boolean, true по-умолчанию) - противоположность leading.
Если задан как true, то разрешает запуск функции по прошествии заданного в параметре time времени. Если false, то соответственно запрещает.

Если мы одновременно зададим  { leading: true, trailing: true }, то у нас из одного вызова функции получится сразу два. Первый будет сразу, а второй по прошествии заданного времени.

Если всё ещё не понятно, то рекомендую запустить локально данный пример с разными настройками данной функции

  const handleClick = debounce(
    (count) => {
      console.log("click happened!", count);
    },
    3000,
    { leading: true, maxWait: 3500, trailing: true }
 */

/**
     * Методы функции
Помимо параметров, данная функция имеет 2 метода:

cancel() - отменяет отложенный вызов до его запуска
flush() - наоборот, запускает отложенный вызов раньше времени

Добавим 2 элемента к предыдущему коду:

<button
  onClick={() => {
    handleClick.cancel();
  }}
  >
  Cancel
</button>

<button
  onClick={() => {
    handleClick.flush();
   }}
  >
  Call immediately
</button>
     */

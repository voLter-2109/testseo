// Функция для извлечения вложенного значения по ключу
function getNestedValue(obj: any, keyPath: string): any {
  return keyPath
    .split('.')
    .reduce((acc, key) => (acc ? acc[key] : undefined), obj);
}

/**
 *
 * @param arr1
 * @param arr2
 * @param uniqueKey
 * @param sortKey1
 * @param sortKey2 второй параметр не обязателен, используется для сортировки по is_favorite
 * @returns
 */
function getUniqueAndSortedArray<T>({
  uniqueKey,
  sortKey1,
  arr1,
  arr2,
  sortFavorite,
}: {
  uniqueKey: keyof T;
  sortKey1: string;
  arr1: T[];
  arr2?: T[];
  sortFavorite?: boolean;
}): T[] {
  const uniqueMap = new Map<T[keyof T], T>();

  const addUniqueItemsToMap = (arr: T[]) => {
    /* eslint-disable-next-line */
    for (const item of arr) {
      uniqueMap.set(item[uniqueKey], item);
    }
  };

  addUniqueItemsToMap(arr1);
  if (arr2) addUniqueItemsToMap(arr2);

  const getValueWithFallback = (obj: any, key: string) => {
    const value = getNestedValue(obj, key);
    return value !== undefined ? value : null; // если значение отсутствует, возвращаем null
  };
  if (sortFavorite) {
    const sortFav = 'is_favorite';

    return Array.from(uniqueMap.values()).sort((a, b) => {
      const aValueF = getValueWithFallback(a, sortFav);
      const bValueF = getValueWithFallback(b, sortFav);
      const aValueS = getValueWithFallback(a, sortKey1);
      const bValueS = getValueWithFallback(b, sortKey1);

      // Сортировка по is_favorite
      if (aValueF !== bValueF) {
        return aValueF ? -1 : 1;
      }

      // Сортировка по sortKey1
      if (aValueS !== null && bValueS === null) return -1; // Если b не имеет значения для sortKey1, перемещаем его вниз
      if (aValueS === null && bValueS !== null) return 1; // Если a не имеет значения для sortKey1, перемещаем его вниз
      if (aValueS < bValueS) return 1;
      if (aValueS > bValueS) return -1;

      return 0;
    });
  }

  // Обычная сортировка без учета is_favorite
  return Array.from(uniqueMap.values()).sort((a, b) => {
    const aValueS = getValueWithFallback(a, sortKey1);
    const bValueS = getValueWithFallback(b, sortKey1);

    // Если a не имеет значения для sortKey1, перемещаем его вниз
    if (aValueS !== null && bValueS === null) return -1;
    if (aValueS === null && bValueS !== null) return 1;

    if (aValueS < bValueS) return 1;
    if (aValueS > bValueS) return -1;

    return 0;
  });
}

export default getUniqueAndSortedArray;

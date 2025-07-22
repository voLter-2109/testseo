1. изменена папка auth
2. изменена папка user
3. изменена папка helath-diary
4. изменена папка chat
5. изменена папка doctor

отмечаем тут то что уже изменили

// прописываем типы data: то что отправляется
// axiosClassic.get<T> - то что возвращается (для запросов без авторизации)
// axiosWithAuth.get<T> - то что возвращается (для запросов с авторизацией)

к каждому методу добавляем описание через JsDoc
example
/**
 * @property {boolean} isLoading?
 * @property {string} textBtn?
 * @property {boolean} isDisable?
 * @enum {string} 'submit' | 'button' | 'reset'
 * @property {classNameBtn} classNameBtn?
 */


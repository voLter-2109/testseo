// страница ввода кода
export const SIGN_IN_SUCCESSFUL_MESSAGE = 'Вы успешно авторизованы!';

// offline online
export const OFFLINE_MESSAGE = 'отсутствует подключение к интернету';
export const ONLINE_MESSAGE = 'подключение к интернету восстановлено';

// schemas-user
export const REQUIRED_TEXT = 'Поле обязательно для заполнения';
export const YEARS_OLD = 'Вам  должно быть не менее 18 лет';
export const INCORRECT_PHONE_NUMBER =
  'Проверьте правильность введенного номера';
export const INCORRECT_NAME_ERROR =
  'Поле должно содержать только кириллицу пробел или дефис между словами.';
export const PROFILE_UPDATE_SUCCESSFUL_MESSAGE =
  'Данные Вашего профиля успешно изменены!';

export const FILE_FORMAT_ERROR_MESSAGE =
  'Допустимые форматы файла: jpg, pdf, png, zip"';

export const FILE_SIZE_ERROR_MESSAGE_10 =
  'Ошибка: ограничение по весу файла 10мб';
export const FILE_NOT_ERROR = 'Ошибка: выберите хотя бы один файл.';
export const FILE_SELECT_ERROR_5 = 'Ошибка: выберите не более 5 файлов.';
export const FILE_FORMAT_MESSAGE =
  'Ошибка: выбранный файл неверного формата. Пожалуйста, выберите другой.';
export const FILE_SIZE_ERROR_MESSAGE_20 =
  'Ошибка: ограничение по весу файла 20мб';
export const FILE_INCORRECT_ERROR =
  'Ошибка: выбран некорректный файл. Пожалуйста, выберите другой.';

export const FILE_FORMAT_FOR_DIPLOMA_SUCCESS = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
  'application/zip',
  'application/x-zip-compressed',
];

export const IMAGE_FORMAT_FOR_AVATAR = ['image/*'];

export const ALLOWED_IMAGE_EXT_REGEX =
  /(\.png|\.jpg|\.jpeg|\.gif\|.raw\.tiff|\.bmp|\.psd)$/;
export const ALLOWED_IMAGE_TYPE_FORMAT = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/gif',
  'image/raw.tiff',
  'image/bmp',
  'image/psd',
];

export const ALLOWED_CHANEL_IMAGE_TYPE_FORMAT = [
  'image/jpeg',
  'image/jpg',
  'image/bmp',
  'image/png',
];

export const ALLOWED_FILE_EXT_REGEX =
  /(\.pdf|\.docx|\.doc|\.xlsx|\.rar|\.zip|\.rtf|\.txt)$/;
export const FILE_TYPE_FORMAT = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/doc',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/rar',
  'application/zip',
  'application/rtf',
  'application/txt',
];

export const ALLOWED_AUDIO_EXT_REGEX = /(\.mp3|\.wav|\.ogg)$/;
export const AUDIO_TYPE_FORMAT = [
  'audio/mp3',
  'audio/wav',
  'audio/ogg',
  'audio/mpeg',
];

export const TAG_REGEX = /(<(\/?[^>]+)>)/g;

export const LINK_REGEX =
  /((?:https?:\/\/)?(?:[\w-]{1,32}\.[\w-]{1,32})[^\s@]*)/gm;

export const SERVER_UNKNOWN_ERROR = 'Что-то пошло не так...';

// !...
export const REFRESH_TOKEN_NOT_FOUND = 'Необходимо авторизоваться';

export const INCORRECT_EMAIL_ERROR = 'Поле должно содержать Email.';

export const SEARCH_QUERY_UNKNOWN_ERROR =
  'Во время запроса произошла ошибка. ' +
  'Возможно, проблема с соединением или сервер недоступен. ' +
  'Подождите немного и попробуйте ещё раз.';
export const SEARCH_QUERY_NOT_FOUND_ERROR = 'Ничего не найдено';
export const SEARCH_QUERY_EMPTY_QUERY_ERROR =
  'Поле поиска должно быть заполнено';

export const SIGN_OUT_SUCCESSFUL_MESSAGE = 'Вы успешно вышли из аккаунта!';

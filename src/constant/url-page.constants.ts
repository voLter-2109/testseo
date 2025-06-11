// Route\ page ChatLayout
export const TITLE_MAIN = 'doc24';

// страница ввода номера
export const REGISTRATION_PAGE = 'registration';
export const TITLE_REGISTRATION_PAGE = 'registration';

// chat layout - mobile content
export const CHAT_MOBILE_PAGE = 'm';
export const SETTINGS_MOBILE_PAGE = 'settings';
export const REGISTRATION_MOBILE_PAGE = '/m/registration';

// Glovallayout chat
export const GLOBAL_LAYOUT = '';

//  chat web
export const CHAT_PAGE = '/';

// chat layout - web content
export const CHAT_PAGE_WEB = '';

// select user chat
// динамический title
export const USER_CHAT = ':uid';
export const DOCTOR_PAGE = ':doctorUid';

// страница с блокировкой пока не is_confirm_doctor = false
export const VERIFICATION_PAGE = 'verification';
export const TITLE_VERIFICATION_PAGE = 'verification';

// страница пока is_fulled = false
export const CREATE_PROFILE_PAGE = 'create-profile';
export const TITLE_CREATE_PROFILE_PAGE = 'create-profile';

// наши доктора
export const OUR_DOCTORS_PAGE = 'our-doctors';

// страница с юридическими документами
export const DOCUMENTS_PAGE = 'documents';
export const DOCUMENTS_PAGE_NAVIGATE = 'documents/personal-data-agreement';
export const PERSONAL_DATA_AGREEMENT_PAGE = 'personal-data-agreement';
export const USER_AGREEMENT_PAGE = 'user-agreement';
export const POLICY_PERSONAL_DATA_PAGE = 'policy-personal-data';
export const PERSONAL_DATA_AGREEMENT_MOBILE_PAGE =
  '/m/documents/personal-data-agreement';

export const NOT_FOUND_PAGE = '*';
export const TITLE_NOT_FOUND_PAGE = '404 | Page not found';

export const ROUTES_SHOW_FOOTER = [
  DOCUMENTS_PAGE,
  PERSONAL_DATA_AGREEMENT_PAGE,
  USER_AGREEMENT_PAGE,
  POLICY_PERSONAL_DATA_PAGE,
  OUR_DOCTORS_PAGE,
];

export const ROUTES_SHOW_BOTTOM_BAR = [
  DOCUMENTS_PAGE,
  PERSONAL_DATA_AGREEMENT_PAGE,
  USER_AGREEMENT_PAGE,
  POLICY_PERSONAL_DATA_PAGE,
  OUR_DOCTORS_PAGE,
  SETTINGS_MOBILE_PAGE,
  CREATE_PROFILE_PAGE,
  REGISTRATION_PAGE,
];

export const AUTH_REQUIRED_ROUTES = [
  CHAT_PAGE,
  CHAT_PAGE_WEB,
  CHAT_MOBILE_PAGE,
  VERIFICATION_PAGE,
  CREATE_PROFILE_PAGE,
  USER_CHAT,
];

export const OTHER_ROUTES = [
  REGISTRATION_PAGE,
  REGISTRATION_MOBILE_PAGE,
  NOT_FOUND_PAGE,
];

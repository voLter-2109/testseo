import { ReactNode } from 'react';

import messages from '../assets/mobile-navigation/messages.svg';
import our_doctors from '../assets/mobile-navigation/our-doctors.svg';
import settings from '../assets/mobile-navigation/settings.svg';

import setSvg from './setSvg';

import {
  CHAT_PAGE,
  DOCUMENTS_PAGE_NAVIGATE,
  GLOBAL_LAYOUT,
  OUR_DOCTORS_PAGE,
  PERSONAL_DATA_AGREEMENT_PAGE,
  POLICY_PERSONAL_DATA_PAGE,
  SETTINGS_MOBILE_PAGE,
  USER_AGREEMENT_PAGE,
} from './url-page.constants';

export interface SideBarItem {
  title: string;
  href: string;
  image?: {
    light: ReactNode;
    dark: ReactNode;
  };
}

export const NAVIGATION_LINKS: SideBarItem[] = [
  { title: 'Наши врачи', href: OUR_DOCTORS_PAGE, image: setSvg().doctor },
  {
    title: 'Юридическая информация',
    href: DOCUMENTS_PAGE_NAVIGATE,
    image: setSvg().law,
  },
];

export const NAVIGATION_LINKS_ALL: SideBarItem[] = [
  { title: 'Наши врачи', href: OUR_DOCTORS_PAGE, image: setSvg().doctor },
  {
    title: 'Чаты',
    href: CHAT_PAGE,
    image: setSvg().message,
  },
  {
    title: 'Юридическая информация',
    href: DOCUMENTS_PAGE_NAVIGATE,
    image: setSvg().law,
  },
];

export const DOCUMENTS_LINKS: SideBarItem[] = [
  {
    title:
      'Согласие на обработку персональных данных при использовании сервиса ООО «Докт24»',
    href: PERSONAL_DATA_AGREEMENT_PAGE,
  },
  { title: 'Пользовательское соглашение', href: USER_AGREEMENT_PAGE },
  {
    title: 'Политика в отношении обработки персональных данных',
    href: POLICY_PERSONAL_DATA_PAGE,
  },
];

export const MOBILE_NAVIGATION_LINKS = [
  { path: OUR_DOCTORS_PAGE, icon: our_doctors, label: 'Наши врачи' },
  { path: GLOBAL_LAYOUT, icon: messages, label: 'Чаты' },
  { path: SETTINGS_MOBILE_PAGE, icon: settings, label: 'Настройки' },
];

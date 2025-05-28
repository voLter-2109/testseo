import { isBrowser, isMobile } from 'react-device-detect';
import { useMediaQuery } from 'react-responsive';

import {
  LARGE_DEVICE,
  MOBILE_L,
  MOBILE_M,
  MOBILE_S,
  TABLE,
  TABLE_MIN,
  TABLE_MINI,
} from '../constant/cssBreakpoints';

/**
 *  @description проверка isBrowser isMobile осуществляется только один раз при монтировании всего приложения
  * @returns  isBrowser (компьютер) проверяет зашли ли вы с компьютера или с телефона
  * @returns  isMobile (телефон) проверяет зашли ли вы с компьютера или с телефона
  *
  * @returns  width вывод ширины экрана с задержкой 500мс
  * @returns  height вывод высоты экрана с задержкой 500мс
  *
  * @return mobileS max-width 320
  * @return mobileM max-width 375
  * @return mobileL max-width 540
  * @return tableMin max-width 720
  * @return tableMini max-width 790
  * @return table max-width 1024
  * @return largeDevise min-width 1280
  * @return largeDeviseSm min-width 1024

  *  @example
    const {
    isBrowser,
    isMobile,
    width,
  } = useWindowResize();
 */
const useWindowResize = () => {
  /**
  «Каноническими» считаются следующие размеры дисплея для разных устройств:
  Смартфоны — 320 пикселей, 425 и выше;
  Планшеты — 768 пикселей и выше;
  Ноутбуки — 1024 пикселей и выше;
  */
  // mobile
  const mobileS = useMediaQuery({
    query: `only screen and (max-width : ${MOBILE_S}px)`,
  });
  const mobileM = useMediaQuery({
    query: `only screen and (max-width : ${MOBILE_M}px)`,
  });

  const mobileL = useMediaQuery({
    query: `only screen and (max-width : ${MOBILE_L}px)`,
  });
  const isPortrait = useMediaQuery({ query: '(orientation: portrait)' });

  // table
  const table = useMediaQuery({
    query: `only screen and (max-width : ${TABLE}px)`,
  });

  const tableMini = useMediaQuery({
    query: `only screen and (max-width : ${TABLE_MINI}px)`,
  });

  const tableMin = useMediaQuery({
    query: `only screen and (max-width : ${TABLE_MIN}px)`,
  });
  // desktop

  const largeDeviseSm = useMediaQuery({
    query: `only screen and (min-width : 1024px)`,
  });

  const largeDevise = useMediaQuery({
    query: `only screen and (min-width : ${LARGE_DEVICE}px)`,
  });

  return {
    table,
    mobileL,
    mobileM,
    mobileS,
    isMobile,
    tableMin,
    isBrowser,
    tableMini,
    isPortrait,
    largeDevise,
    largeDeviseSm,
  };
};

export default useWindowResize;

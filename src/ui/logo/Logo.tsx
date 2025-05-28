import { FC, memo } from 'react';

import styles from './logo.module.scss';

interface LogoProps {
  size: 'big' | 'small';
}

/**
 *
 * @returns логотип с тестом Док24 с пропсом 'big' | 'small'
 */
const Logo: FC<LogoProps> = ({ size }) => {
  return (
    <div
      className={size === 'big' ? styles.logo_big : styles.logo}
      title="Логотип doct24"
    >
      {' '}
    </div>
  );
};

export default memo(Logo);

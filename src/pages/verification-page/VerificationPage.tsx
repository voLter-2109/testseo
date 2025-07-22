import { FC, memo } from 'react';

import Verifications from '../../components/verification/Verifications';

import style from './VerificationPage.module.scss';

const VerificationPage: FC = () => {
  return (
    <div className={style.wrapper}>
      <div className={style.verification}>
        <Verifications />
      </div>
    </div>
  );
};

export default memo(VerificationPage);

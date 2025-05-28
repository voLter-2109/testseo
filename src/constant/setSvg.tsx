import { ReactNode } from 'react';

import { ReactComponent as DoctorIconDark } from '../assets/side-menu/doctor-dark.svg';
import { ReactComponent as DoctorIcon } from '../assets/side-menu/doctor.svg';

import { ReactComponent as LawIconDark } from '../assets/side-menu/law-dark.svg';
import { ReactComponent as LawIcon } from '../assets/side-menu/law.svg';

import { ReactComponent as MessageIconDark } from '../assets/side-menu/message-dark.svg';
import { ReactComponent as MessageIcon } from '../assets/side-menu/message.svg';

interface Props {
  doctor: { light: ReactNode; dark: ReactNode };
  law: { light: ReactNode; dark: ReactNode };
  message: { light: ReactNode; dark: ReactNode };
}

const setSvg = (): Props => {
  return {
    doctor: {
      light: <DoctorIcon />,
      dark: <DoctorIconDark />,
    },
    law: {
      light: <LawIcon />,
      dark: <LawIconDark />,
    },
    message: {
      light: <MessageIcon />,
      dark: <MessageIconDark />,
    },
  };
};

export default setSvg;

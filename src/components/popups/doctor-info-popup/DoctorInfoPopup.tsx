import { FC } from 'react';
import { NavLink } from 'react-router-dom';

import useWindowResize from '../../../hooks/useWindowResize';
import { DoctorInfo } from '../../../types/doctor/doctor';
import CustomButton from '../../../ui/custom-button/Button';
import Popup from '../../../ui/popup/Popup';
import InformationBlockContent from '../../chat-select-window/informationBlock.tsx/information-block-content/InformationBlockContent';

import style from './doctorInfoWrapper.module.scss';

interface DoctorInfoPopupProps {
  selectedDoctor: DoctorInfo | null;
  isDoctorInfoPopupOpen: boolean;
  closeDoctorInfoPopup: () => void;
}

const DoctorInfoPopup: FC<DoctorInfoPopupProps> = ({
  selectedDoctor,
  isDoctorInfoPopupOpen,
  closeDoctorInfoPopup,
}) => {
  const { mobileL } = useWindowResize();

  if (!selectedDoctor) {
    return null;
  }

  const { id } = selectedDoctor;

  return (
    <Popup isOpen={isDoctorInfoPopupOpen} onClose={closeDoctorInfoPopup}>
      <div className={style.popupInf}>
        <CustomButton
          textBtn="Назад"
          styleBtn="blue"
          onClick={closeDoctorInfoPopup}
        />
        <InformationBlockContent {...selectedDoctor} />
        <NavLink
          to={mobileL ? `/m/${id}` : `/${id}`}
          onClick={() => {
            closeDoctorInfoPopup();
          }}
          style={{ display: 'flex', justifyContent: 'center' }}
        >
          <CustomButton textBtn="Написать" styleBtn="primary" />
        </NavLink>
      </div>
    </Popup>
  );
};

export default DoctorInfoPopup;

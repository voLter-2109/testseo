import { FC, useState } from 'react';

import { DoctorInfo } from '../../../../types/doctor/doctor';
import ChatItemDoctor from '../../../chat-item/ChatItemDoctor';
import DoctorInfoPopup from '../../../popups/doctor-info-popup/DoctorInfoPopup';

type Props = {
  listData: DoctorInfo[];
  refDocLast: (node?: Element | null) => void;
};

const NavBarDoctorList: FC<Props> = ({ listData, refDocLast }) => {
  const [isDoctorInfoPopupOpen, setDoctorInfoPopupOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorInfo | null>(null);

  const handleChatItemDoctorClick = (doctor: DoctorInfo) => {
    setSelectedDoctor(doctor);
    setDoctorInfoPopupOpen(true);
  };

  const closeDoctorInfoPopup = () => {
    setDoctorInfoPopupOpen(false);
    setSelectedDoctor(null);
  };

  return (
    <>
      {listData.map((doc, i) => (
        <ChatItemDoctor
          key={doc.id}
          doctor={doc}
          ref={i === listData.length - 1 ? refDocLast : null}
          handleChatItemDoctorClick={() => handleChatItemDoctorClick(doc)}
        />
      ))}
      <DoctorInfoPopup
        selectedDoctor={selectedDoctor}
        isDoctorInfoPopupOpen={isDoctorInfoPopupOpen}
        closeDoctorInfoPopup={closeDoctorInfoPopup}
      />
    </>
  );
};

export default NavBarDoctorList;

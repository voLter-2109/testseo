import { FC } from 'react';

import { ReactComponent as MicSvg } from '../../../assets/bottom-bar/mic.svg';
import CustomButton from '../../../ui/custom-button/Button';
import Popup from '../../../ui/popup/Popup';
import CustomTitle from '../../../ui/title/CustomTitle';

import style from './microphonePopup.module.scss';

interface MicrophonePopupProps {
  openModal: boolean;
  closeMicrophonePopup: () => void;
  errorType?: 'no-device' | 'no-permission' | null;
}

const MicrophonePopup: FC<MicrophonePopupProps> = ({
  openModal,
  closeMicrophonePopup,
  errorType,
}) => {
  if (!openModal) {
    return null;
  }

  return (
    <Popup isOpen={openModal} onClose={closeMicrophonePopup}>
      <div className={style.modal}>
        <CustomTitle>
          {errorType === 'no-device'
            ? 'Микрофон не найден'
            : 'Разрешите доступ к микрофону'}
        </CustomTitle>
        {errorType === 'no-device' ? (
          <p>
            На вашем устройстве не найден микрофон. Пожалуйста, подключите
            микрофон и попробуйте снова.
          </p>
        ) : (
          <p>
            Для записи голосовых сообщений необходим доступ к микрофону вашего
            компьютера. Нажмите на
            <MicSvg className={style.mic} /> в адресной строке и выберите
            &quot;Всегда предоставлять сайту доступ к микрофону&ldquo;.
          </p>
        )}
        <CustomButton
          textBtn="Ясно"
          onClick={() => {
            closeMicrophonePopup();
          }}
        />
      </div>
    </Popup>
  );
};

export default MicrophonePopup;

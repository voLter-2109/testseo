import { useState } from 'react';
import toast from 'react-hot-toast';

const useMicrophoneCheck = () => {
  const notifyError = (text: string) => toast.error(text);
  // стейт на открытое модальное окно, что использвать микрофон запрещено
  const [openModal, setModalOpen] = useState<boolean>(false);
  const [errorType, setErrorType] = useState<
    'no-device' | 'no-permission' | null
  >(null);

  const openMicrophonePopup = (
    type: 'no-device' | 'no-permission' | null = null
  ) => {
    setErrorType(type);
    setModalOpen(true);
  };

  const closeMicrophonePopup = () => {
    setModalOpen(false);
    setErrorType(null);
  };

  //* функция для проверки разрешил ли пользователь использовать микрофон
  const canIUseMicrophone = async (open: boolean = true) => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      notifyError('Использование микрофона не поддерживается');
      if (open) openMicrophonePopup('no-device');
      return false;
    }

    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const hasMic = devices.some((device) => device.kind === 'audioinput');

      if (!hasMic) {
        notifyError('Микрофон не найден на устройстве');
        if (open) openMicrophonePopup('no-device');
        return false;
      }

      await navigator.mediaDevices.getUserMedia({ audio: true });
      return true;
    } catch (er: any) {
      console.log('Ошибка доступа к микрофону: ', er);

      if (
        er.name === 'NotAllowedError' ||
        er.name === 'PermissionDeniedError'
      ) {
        notifyError('Разрешение на доступ к микрофону отклонено');
        if (open) openMicrophonePopup('no-permission');
      } else {
        notifyError('Доступ к микрофону запрещён');
        if (open) openMicrophonePopup('no-permission');
      }
      return false;
    }
  };

  return {
    canIUseMicrophone,
    openMicrophonePopup,
    closeMicrophonePopup,
    openModal,
    errorType,
  };
};

export default useMicrophoneCheck;

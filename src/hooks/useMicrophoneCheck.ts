import { useState } from 'react';
import toast from 'react-hot-toast';

const useMicrophoneCheck = () => {
  const notifyError = (text: string) => toast.error(text);
  // стейт на открытое модальное окно, что использвать микрофон запрещено
  const [openModal, setModalOpen] = useState<boolean>(false);

  const openMicrophonePopup = () => {
    setModalOpen(true);
  };
  const closeMicrophonePopup = () => {
    setModalOpen(false);
  };

  //* функция для проверки разрешил ли пользователь использовать микрофон
  const canIUseMicrophone = (open: boolean = true) => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true }).catch((er) => {
        console.log('Ошибка доступа к микрофону: ', er);
        if (er instanceof DOMException) {
          if (er.message.includes('Permission denied by system')) {
            notifyError(`Разрешение на доступ к микрофону отклонено системой`);
          } else if (
            !er.message.includes('Permission denied by system') &&
            er.message.includes('Permission denied')
          ) {
            notifyError(`Разрешение на доступ к микрофону отклонено`);
          } else {
            notifyError(`Доступ к микрофону запрещён`);
          }
        }
        if (open) openMicrophonePopup();
      });
    } else {
      notifyError(`Использование микрофона не поддерживается`);
    }
  };

  return {
    canIUseMicrophone,
    openMicrophonePopup,
    closeMicrophonePopup,
    openModal,
  };
};

export default useMicrophoneCheck;

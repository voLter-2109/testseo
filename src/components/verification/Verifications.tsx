import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

import doctor from '../../assets/verification-page/verification.png';
import CustomButton from '../../ui/custom-button/Button';

import { QKEY_GET_USER } from '../../constant/querykeyConstants';

import useWindowResize from '../../hooks/useWindowResize';
import ExitButton from '../../ui/exit-button/ExitButton';

import style from './Verifications.module.scss';

/**
 *
 * @returns страница верификации, при нажатии на кнопку будет повторный запрос юзера,
 * надо логику получения юзера вынести в отдельный хук
 */
const Verifications = () => {
  const queryClient = useQueryClient();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [check, setCheck] = useState<boolean>(false);
  const { mobileL } = useWindowResize();

  const notifySuccess = (test: string, dur: number = 3000) =>
    toast.success(test, {
      duration: dur,
    });

  const notifyError = (test: string, dur: number = 3000) =>
    toast.error(test, {
      duration: dur,
    });

  const handleRefreshUser = async () => {
    setCheck(true);
    console.log(1);
    await queryClient.invalidateQueries({ queryKey: [QKEY_GET_USER] });
    console.log(2);
    const res: any = queryClient.getQueriesData({
      queryKey: [QKEY_GET_USER],
      fetchStatus: 'idle',
    });

    intervalRef.current = setTimeout(() => {
      setCheck(false);
      if (res[0][1].data.is_confirmed_doctor) {
        return notifySuccess('Модерация пройдена');
      }

      return notifyError('Модерация не пройдена');
    }, 2000);
  };

  useEffect(() => {
    return clearTimeout(intervalRef.current as NodeJS.Timeout);
  }, []);

  return (
    <div className={style.wrapper}>
      <div className={style.verification}>
        <img src={doctor} alt="verification" />
        <span className={style.text}>
          Процесс проверки может занять до 24 часов. <br />
          После сообщения от техподдержки, Вы сможете пользоваться приложением.
        </span>
      </div>
      <CustomButton
        classNameBtn={style.btn}
        onClick={handleRefreshUser}
        textBtn={check ? 'Проверяем...' : 'Проверить'}
      />
      {mobileL && <ExitButton classNameBtn={style.smallEx} />}
    </div>
  );
};

export default Verifications;

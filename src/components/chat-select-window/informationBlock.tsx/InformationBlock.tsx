import classNames from 'classnames';
import {
  FC,
  HTMLAttributes,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';

import { DoctorInfo } from '../../../types/doctor/doctor';

import Spinner from '../../../ui/spinner/Spinner';

import CustomButton from '../../../ui/custom-button/Button';
import Attachments from '../../attachments/Attachments';

import CrossBtn from '../../../ui/cross-button/CrossBtn';

import InformationBlockContent from './information-block-content/InformationBlockContent';

import style from './informationBlock.module.scss';
import InfoChannelBlockContent from './information-block-content/infoChannelBlockContent';

interface Props extends HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  isError: boolean;
  isDoctor: boolean;
  isChat: boolean;
  uid: string | null;
  isLoading: boolean;
  doctorInfo: DoctorInfo | null;
  refetchDoctorData: () => void;
  handleToggleInfInformationPanel: () => void;
}

const InformationBlock: FC<Props> = ({
  uid,
  isOpen,
  isError,
  isLoading,
  isDoctor,
  isChat,
  doctorInfo,
  handleToggleInfInformationPanel,
  ...HTMLDivElementAttr
}) => {
  const [trigger, setTrigger] = useState<'info' | 'attach'>('info');
  useEffect(() => {
    setTrigger(isDoctor || !isChat ? 'info' : 'attach');
  }, [isDoctor]);

  const nodeRef = useRef<any>(null);

  const handleAttach = useCallback(() => {
    setTrigger('attach');
  }, [setTrigger]);

  const handleInfo = useCallback(() => {
    setTrigger('info');
  }, [setTrigger]);

  if (isLoading || !uid) {
    return (
      <div
        className={classNames(
          style.wrapper,
          HTMLDivElementAttr.className,
          style.information__loading
        )}
      >
        <Spinner size="md" color="blue" classNameContainer={style.spinner} />
      </div>
    );
  }

  // ! задача refetch doctor сделать внутри компонента InformationBlockContent
  return (
    <div className={classNames(HTMLDivElementAttr.className, style.wrapper)}>
      <div className={style.headerInf}>
        <div className={style.closeContainer}>
          <CrossBtn onClick={handleToggleInfInformationPanel} />
        </div>

        <div className={style.infoBlock}>
          {(doctorInfo || !isChat) && (
            <CustomButton
              styleBtn="blue"
              classNameBtn={classNames({
                [style.inactiveTitle]: trigger === 'info',
              })}
              onClick={handleInfo}
            >
              Собеседник
            </CustomButton>
          )}
          <CustomButton
            styleBtn="blue"
            classNameBtn={classNames({
              [style.inactiveTitle]: trigger === 'attach',
            })}
            onClick={handleAttach}
          >
            Вложения
          </CustomButton>
        </div>
      </div>
      <hr className={style.hr} />
      <SwitchTransition mode="out-in">
        <CSSTransition
          nodeRef={nodeRef}
          addEndListener={(done: () => void) => {
            nodeRef.current?.addEventListener('transitionend', done, false);
          }}
          classNames="fade"
          key={trigger === 'info' ? 'info' : 'attach'}
        >
          <div ref={nodeRef} className={classNames(style.registrationBlock)}>
            {trigger === 'info' ? (
              !isError &&
              (doctorInfo ? (
                <InformationBlockContent {...doctorInfo} />
              ) : !isChat ? (
                <InfoChannelBlockContent uid={uid} />
              ) : (
                ''
              ))
            ) : (
              <Attachments uid={uid} isOpen={isOpen} />
            )}
          </div>
        </CSSTransition>
      </SwitchTransition>
    </div>
  );
};

export default InformationBlock;

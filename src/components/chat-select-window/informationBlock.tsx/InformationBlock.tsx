import classNames from 'classnames';
import {
  FC,
  HTMLAttributes,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';

import { ReactComponent as Cross } from '../../../assets/create-profile/cross.svg';
import { DoctorInfo } from '../../../types/doctor/doctor';

import Spinner from '../../../ui/spinner/Spinner';

import CustomButton from '../../../ui/custom-button/Button';
import Attachments from '../../attachments/Attachments';

import InformationBlockContent from './information-block-content/InformationBlockContent';

import style from './informationBlock.module.scss';

interface Props extends HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  isError: boolean;
  isDoctor: boolean;
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
  doctorInfo,
  handleToggleInfInformationPanel,
  ...HTMLDivElementAttr
}) => {
  const [trigger, setTrigger] = useState<'info' | 'attach'>('info');
  useEffect(() => {
    setTrigger(isDoctor ? 'info' : 'attach');
  }, [isDoctor]);

  const nodeRef = useRef<any>(null);

  const handleAttach = useCallback(() => {
    setTrigger('attach');
  }, [setTrigger]);

  const handleInfo = useCallback(() => {
    setTrigger('info');
  }, [setTrigger]);

  const memoizedCross = useMemo(
    () => (
      <Cross
        onClick={handleToggleInfInformationPanel}
        className={classNames(style.btn_svg)}
      />
    ),
    []
  );

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

  // if (!uid) {
  //   return (
  //     <div className={classNames(HTMLDivElementAttr.className, style.wrapper)}>
  //       <OutletLoading />
  //     </div>
  //   );
  // }

  // ! задача refetch doctor сделать внутри компонента InformationBlockContent
  return (
    <div className={classNames(HTMLDivElementAttr.className, style.wrapper)}>
      <div className={style.headerInf}>
        {memoizedCross}
        <div className={style.infoBlock}>
          {doctorInfo && (
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
              doctorInfo &&
              !isError && <InformationBlockContent {...doctorInfo} />
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

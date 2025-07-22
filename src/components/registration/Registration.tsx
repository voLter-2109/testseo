import classNames from 'classnames';
import { memo, useCallback, useRef, useState } from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';

import style from './Registration.module.scss';
import CodeBlock from './code-block/CodeBlock';
import PhoneBlock from './phoneBlock/PhoneBlock';

const Registration = () => {
  console.log('перерисовка Registration 2 слой');

  const [trigger, setTrigger] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const nodeRef = useRef<any>(null);

  const handleResetPhoneNumber = useCallback(() => {
    setTrigger(true);
    setPhoneNumber('');
  }, []);

  return (
    <div className={style.wrapper}>
      <SwitchTransition mode="out-in">
        <CSSTransition
          nodeRef={nodeRef}
          addEndListener={(done: () => void) => {
            nodeRef.current?.addEventListener('transitionend', done, false);
          }}
          classNames="fade"
          key={trigger ? 'phone' : 'code'}
        >
          <div ref={nodeRef} className={classNames(style.registrationBlock)}>
            {trigger ? (
              <PhoneBlock
                setTrigger={setTrigger}
                setPhoneNumber={setPhoneNumber}
                phoneNumber={phoneNumber}
              />
            ) : (
              <CodeBlock
                handleResetPhoneNumber={handleResetPhoneNumber}
                phoneNumber={phoneNumber}
              />
            )}
          </div>
        </CSSTransition>
      </SwitchTransition>
    </div>
  );
};

export default memo(Registration);

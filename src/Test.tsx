// /* eslint-disable @typescript-eslint/naming-convention */

import { useState } from 'react';

import style from './test.module.scss';

const Test = () => {
  const [check, setCheck] = useState(false);

  const handleSetCheck = () => {
    setCheck((prev) => !prev);
  };

  return (
    <>
      <div style={{ margin: '30px' }} className={style.check}>
        <input
          className={style.check_input}
          id="avatar_input"
          type="checkbox"
          checked={check}
          onChange={handleSetCheck}
          style={{ display: 'none' }}
        />
        <div className={style.checkbox} onClick={handleSetCheck} />
      </div>
    </>
  );
};

export default Test;

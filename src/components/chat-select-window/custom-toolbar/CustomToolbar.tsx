import { FC } from 'react';

import styles from './CustomToolbar.module.scss';

const CustomToolbar: FC = () => {
  return (
    <div id="my-toolbar" className={styles.toolbar}>
      <button type="button" className="ql-bold" aria-label="make bold text" />
      <button
        type="button"
        className="ql-italic"
        aria-label="make italic text"
      />
      <button
        type="button"
        className="ql-underline"
        aria-label="make underline text"
      />
      <button
        type="button"
        className="ql-strike"
        aria-label="make strikethrow text"
      />
    </div>
  );
};

export default CustomToolbar;

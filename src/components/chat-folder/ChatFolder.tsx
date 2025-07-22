import React from 'react';

import style from './ChatFolder.module.scss';

type Props = {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
};

export default function ChatFolder({ icon, label, onClick }: Props) {
  return (
    <button type="button" className={style.folder} onClick={onClick}>
      <div className={style.folderContainer}>
        <div className={style.folderIcon}>{icon}</div>
        <h2 className={style.folderCaption}>{label}</h2>
      </div>
    </button>
  );
}

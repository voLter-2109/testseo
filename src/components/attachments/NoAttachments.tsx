import { FC } from 'react';

const NoAttachments: FC = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '20px',
        height: '100%',
        alignItems: 'center',
      }}
    >
      <p>В этом чате еще не делились медиа</p>
    </div>
  );
};

export default NoAttachments;

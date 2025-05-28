import { FC } from 'react';
import Skeleton from 'react-loading-skeleton';

import style from './ChatItemSkeleton.module.scss';

interface ChatItemSkeletonProps {
  cards: number;
  usedChat?: boolean;
}

const ChatItemSkeleton: FC<ChatItemSkeletonProps> = ({ cards, usedChat }) => {
  if (usedChat) {
    return (
      <div className={style.wrapperSkeleton_chat}>
        {Array(cards)
          .fill(0)
          .map((_, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <div className={style.skeleton} key={i}>
              <div className={style.rotate}>
                <div className={style.skeleton__message}>
                  <Skeleton count={1} height={50} />
                </div>
              </div>
            </div>
          ))}
      </div>
    );
  }

  return (
    <div className={style.wrapperSkeleton_other}>
      {Array(cards)
        .fill(0)
        .map((_, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <div className={style.skeleton} key={i}>
            <div className={style.skeleton__avatar}>
              <Skeleton circle width={55} height={55} />
            </div>
            <div className={style.skeleton__message}>
              <Skeleton count={2} />
            </div>
          </div>
        ))}
    </div>
  );
};

export default ChatItemSkeleton;

import { FC, useCallback, useRef } from 'react';

import useAttachmentsQueries from '../../api/use-infinite-query/use-attachments-queries/useAttachmentsQueries';
import RootBoundaryComponent from '../../ui/error-component/RootBoundaryComponent';
import OutletLoading from '../../ui/suspense-loading/OutletLoading';
import NoAttachments from '../attachments/NoAttachments';
import AudioMessageItem from '../message-item/audio-message-item/AudioMessageItem';

import style from './attachmentsAudio.module.scss';

type AttachmentsItemProps = {
  uid: string;
  refresh: () => void;
  enabled: boolean;
};

const AttachmentsAudio: FC<AttachmentsItemProps> = ({
  uid,
  enabled,
  refresh,
}) => {
  const observerRef = useRef<IntersectionObserver | null>(null);

  const { audioQuery } = useAttachmentsQueries({
    uid,
    isAudioEnabled: enabled,
    isFilesEnabled: false,
    isImageEnabled: false,
  });

  const { data, isLoading, fetchNextPage, hasNextPage, isError } = audioQuery;

  const lastAudioElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (!node || isLoading || !hasNextPage) return;

      observerRef.current?.disconnect();
      observerRef.current = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) fetchNextPage();
      });

      observerRef.current.observe(node);
    },
    [isLoading, hasNextPage, fetchNextPage]
  );

  if (isLoading) return <OutletLoading />;

  if (isError)
    return <RootBoundaryComponent refreshFunc={refresh} ariaTitle="обновить" />;

  return (
    <div className={style.container}>
      {data && data.length > 0 ? (
        data.map((item, index: number) => (
          <AudioMessageItem
            key={item.id}
            item={item}
            ref={index === data.length - 1 ? lastAudioElementRef : null}
            attach={enabled}
            isAttach
          />
        ))
      ) : (
        <NoAttachments />
      )}
    </div>
  );
};

export default AttachmentsAudio;

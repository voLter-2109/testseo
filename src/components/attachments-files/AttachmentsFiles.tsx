import { FC, useCallback, useRef } from 'react';

import useAttachmentsQueries from '../../api/use-infinite-query/use-attachments-queries/useAttachmentsQueries';
import RootBoundaryComponent from '../../ui/error-component/RootBoundaryComponent';
import OutletLoading from '../../ui/suspense-loading/OutletLoading';
import NoAttachments from '../attachments/NoAttachments';
import FileMessageItem from '../message-item/file-message-item/FileMessageItem';

import style from './attachmentsFile.module.scss';

type AttachmentsItemProps = {
  uid: string;
  refresh: () => void;
  enabled: boolean;
};

const AttachmentsFiles: FC<AttachmentsItemProps> = ({
  uid,
  refresh,
  enabled,
}) => {
  const observerRef = useRef<IntersectionObserver | null>(null);

  const { filesQuery } = useAttachmentsQueries({
    uid,
    isAudioEnabled: false,
    isFilesEnabled: enabled,
    isImageEnabled: false,
  });

  const {
    data: attachmentsFiles,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isError,
  } = filesQuery;

  const lastFileElementRef = useCallback(
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
      {attachmentsFiles && attachmentsFiles.length > 0 ? (
        attachmentsFiles.map((item, index: number) => (
          <FileMessageItem
            key={item.id}
            item={item}
            ref={
              index === attachmentsFiles.length - 1 ? lastFileElementRef : null
            }
          />
        ))
      ) : (
        <NoAttachments />
      )}
    </div>
  );
};

export default AttachmentsFiles;

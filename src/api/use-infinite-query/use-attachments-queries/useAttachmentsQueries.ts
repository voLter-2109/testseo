import { useInfiniteQuery } from '@tanstack/react-query';

import { MAX_ATTACHMENTS_PER_PAGE } from '../../../constant/filterParams';
import { getFileMessagesList } from '../../chat/chat';

type Props = {
  uid: string;
  isImageEnabled: boolean;
  isAudioEnabled: boolean;
  isFilesEnabled: boolean;
};

const useAttachmentsQueries = ({
  uid,
  isImageEnabled,
  isAudioEnabled,
  isFilesEnabled,
}: Props) => {
  const imagesQuery = useInfiniteQuery({
    queryKey: [`getImagesMessagesList: ${uid}`],
    queryFn: ({ pageParam = 1 }) => {
      return getFileMessagesList(uid, {
        page: pageParam,
        search: 'image',
        page_size: MAX_ATTACHMENTS_PER_PAGE,
      });
    },
    getNextPageParam: (lastPage) => {
      const nextPageUrl = lastPage.data.next;
      if (nextPageUrl) {
        const match = nextPageUrl.match(/page=(\d+)/);
        if (match) {
          return parseInt(match[1], 10);
        }
      }
      return undefined;
    },
    select: (data) => {
      return data?.pages.flatMap((page) => page.data.results) || [];
    },
    enabled: isImageEnabled,
    initialPageParam: 1,
  });

  const filesQuery = useInfiniteQuery({
    queryKey: [`getFilesMessagesList: ${uid}`],
    queryFn: ({ pageParam = 1 }) => {
      return getFileMessagesList(uid, {
        page: pageParam,
        search: 'application',
        page_size: MAX_ATTACHMENTS_PER_PAGE,
      });
    },
    getNextPageParam: (lastPage) => {
      const nextPageUrl = lastPage.data.next;
      if (nextPageUrl) {
        const match = nextPageUrl.match(/page=(\d+)/);
        if (match) {
          return parseInt(match[1], 10);
        }
      }
      return undefined;
    },
    select: (data) => {
      return data?.pages.flatMap((page) => page.data.results) || [];
    },
    initialPageParam: 1,
    enabled: isFilesEnabled,
  });

  const audioQuery = useInfiniteQuery({
    queryKey: [`getAudioMessagesList: ${uid}`],
    queryFn: ({ pageParam = 1 }) => {
      return getFileMessagesList(uid, {
        page: pageParam,
        search: 'audio',
        page_size: MAX_ATTACHMENTS_PER_PAGE,
      });
    },
    getNextPageParam: (lastPage) => {
      const nextPageUrl = lastPage.data.next;
      if (nextPageUrl) {
        const match = nextPageUrl.match(/page=(\d+)/);
        if (match) {
          return parseInt(match[1], 10);
        }
      }
      return undefined;
    },
    select: (data) => {
      return data?.pages.flatMap((page) => page.data.results) || [];
    },
    initialPageParam: 1,
    enabled: isAudioEnabled,
  });

  return { imagesQuery, filesQuery, audioQuery };
};

export default useAttachmentsQueries;

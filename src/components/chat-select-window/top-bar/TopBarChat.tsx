import classNames from 'classnames';
import {
  ChangeEvent,
  FC,
  memo,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useNavigate } from 'react-router';
import { CSSTransition, SwitchTransition } from 'react-transition-group';

import { ReactComponent as ClearSvg } from '../../../assets/bottom-bar/cross.svg';
import { ReactComponent as DeleteSvg } from '../../../assets/bottom-bar/trash.svg';
import { ReactComponent as UnverifiedSvg } from '../../../assets/chat-top-bar/badge.svg';
import { ReactComponent as VerifiedSvg } from '../../../assets/chat-top-bar/badge_check.svg';

import { useWindowSize } from '../../../hooks/useWindowSize';

import useChatListStore from '../../../store/chatListStore';

import { MessageListItem } from '../../../types/chat/messageListItem';

import CustomButton from '../../../ui/custom-button/Button';
import ClearFieldBtn from '../../../ui/inputs/clear-filed-btn/ClearFieldBtn';
import InputSearch from '../../../ui/inputs/input-search/InputSearch';
import Avatar from '../../avatar/Avatar';

import useUserStore from '../../../store/userStore';

import { TChannels } from '../../../types/websoket/websoket.types';

import getParticipantWord from '../../../utils/getParticipantWord';

import style from './topBar.module.scss';

type Props = {
  uid: string;
  isDoctor: boolean;
  valueInputSearch: string;
  handleOpenInf: () => void;
  isModeratedDoctor: boolean;
  resetSearchParams: () => void;
  selectedMes: MessageListItem[];
  resetSelectMesForward: () => void;
  setValueInputSearch: (value: string) => void;
};

const getLastOnlinePhrase = (wasOnlineAt: number): string => {
  const now = Date.now(); // в миллисекундах
  const wasOnline = wasOnlineAt * 1000; // преобразуем в миллисекунды

  const diff = now - wasOnline;

  const diffMinutes = Math.floor(diff / (1000 * 60));
  const diffHours = Math.floor(diff / (1000 * 60 * 60));

  const wasDate = new Date(wasOnline);
  const nowDate = new Date();

  const isSameDay =
    wasDate.getDate() === nowDate.getDate() &&
    wasDate.getMonth() === nowDate.getMonth() &&
    wasDate.getFullYear() === nowDate.getFullYear();

  if (diffMinutes < 5) {
    return `был(а) ${diffMinutes} минут назад`;
  }

  if (diffMinutes >= 5 && diffMinutes < 60) {
    return 'был(а) недавно';
  }

  if (diffHours >= 1 && isSameDay) {
    return `был(а) сегодня в ${wasDate
      .getHours()
      .toString()
      .padStart(2, '0')}:${wasDate.getMinutes().toString().padStart(2, '0')}`;
  }

  // если день другой
  return `был(а) в сети ${wasDate.getDate().toString().padStart(2, '0')}.${(
    wasDate.getMonth() + 1
  )
    .toString()
    .padStart(2, '0')}`;
};

const TopBarChat: FC<Props> = ({
  uid,
  isDoctor,
  selectedMes,
  handleOpenInf,
  valueInputSearch,
  isModeratedDoctor,
  resetSearchParams,
  setValueInputSearch,
  resetSelectMesForward,
}) => {
  const [showIcons, setShowIcons] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const nodeRef = useRef<any>(null);
  const user = useUserStore((state) => state.user);

  const navigate = useNavigate();

  const { width } = useWindowSize();

  const userList = useChatListStore((state) => state.userList);

  const companion = useMemo(
    () => (uid ? userList[uid] : null),
    [uid, userList]
  );

  const isChat = useMemo(
    () => companion && companion.chat_type === TChannels.CHAT,
    [companion]
  );

  const { isOnline, wasOnlineAt } = useChatListStore((state) =>
    state.getOnlineStateByUserUid(uid)
  );

  const companionName = useMemo(
    () =>
      isChat
        ? `${companion?.last_name} ${companion?.first_name} ${companion?.patronymic}`
        : companion?.name,
    [companion]
  );

  const titleOnline = useMemo(() => {
    if (isOnline) {
      return 'в сети';
    }
    if (!isOnline && wasOnlineAt) {
      return `${getLastOnlinePhrase(wasOnlineAt)}`;
    }

    return 'не в сети';
  }, [isOnline, uid, wasOnlineAt]);

  const handleClickBtnMore = useCallback(() => {
    setShowIcons(!showIcons);
    setShowSearch(false);
  }, [setShowIcons, setShowSearch]);

  const handleClickBtnSearch = useCallback(() => {
    setShowSearch(!showSearch);
    setShowIcons(false);
  }, [setShowSearch, setShowIcons]);

  const handleChangeValue = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setValueInputSearch(e.currentTarget.value);
    },
    [setValueInputSearch]
  );

  const handleClickBack = useCallback(() => {
    if (width) navigate('../');
  }, [width]);

  const iconsConfig = [
    {
      Component: DeleteSvg,
      props: {
        onClick: (e: React.MouseEvent<SVGSVGElement>) => {
          e.preventDefault();
          console.log('delete');
        },
        className: classNames(style.iconBar, style.trash, {
          [style.hidden]: selectedMes.length >= 4,
        }),
      },
      title: 'удалить сообщения',
      deps: [selectedMes.length],
    },

    {
      Component: ClearSvg,
      props: {
        onClick: (e: React.MouseEvent<SVGSVGElement>) => {
          e.preventDefault();
          resetSelectMesForward();
        },
        title: 'отменить выбор',
        className: classNames(style.iconBar),
      },
      deps: [],
    },
    {
      Component: UnverifiedSvg,
      props: {
        title: 'модерация не пройдена',
      },
      deps: [],
    },
    {
      Component: VerifiedSvg,
      props: {
        title: 'модерация пройдена',
        className: classNames(style.verifiedIcon),
      },
      deps: [],
    },
  ];

  const memoizedIcons = iconsConfig.map(({ Component, props, deps }) =>
    useMemo(() => <Component {...props} />, deps)
  );

  const [
    memorizeDeleteIcon,
    memorizeClearIcon,
    memoizedUnverifiedIcon,
    memoizedVerifiedIcon,
  ] = memoizedIcons;

  const avatarUrl = companion?.avatar_webp_url || companion?.avatar_url;
  const participantsCount = companion?.participants?.length ?? 0;

  return (
    <SwitchTransition mode="out-in">
      <CSSTransition
        nodeRef={nodeRef}
        addEndListener={(done: () => void) => {
          nodeRef.current?.addEventListener('transitionend', done, false);
        }}
        classNames="fadeVerticalTwo"
        key={selectedMes.length ? 'select' : 'write'}
      >
        <div ref={nodeRef}>
          {selectedMes.length ? (
            <div className={style.topBar}>
              <div style={{ width: '30px', height: '30px' }}>
                {memorizeClearIcon}
              </div>
              <div style={{ width: '30px', height: '30px' }}>
                {memorizeDeleteIcon}
              </div>
            </div>
          ) : (
            <div ref={nodeRef} className={style.topBar}>
              {width < 1025 && (
                <CustomButton
                  onClick={handleClickBack}
                  textBtn={' '}
                  classNameBtn={style.back_btn}
                  text-area="Назад"
                  title="Назад"
                />
              )}
              <div className={style.info} onClick={handleOpenInf}>
                <Avatar img={avatarUrl} size="small" />

                {user?.uid === uid ? (
                  <p>Избранное</p>
                ) : (
                  <>
                    {!showSearch ? (
                      <div>
                        <p>{companionName}</p>
                        <span className={style.timeOnline}>
                          {isChat
                            ? titleOnline
                            : `${participantsCount} ${getParticipantWord(
                                participantsCount || 0
                              )}`}
                        </span>
                      </div>
                    ) : null}
                    {isDoctor &&
                      (isModeratedDoctor
                        ? memoizedVerifiedIcon
                        : memoizedUnverifiedIcon)}
                  </>
                )}
              </div>
              {showSearch ? (
                <>
                  <InputSearch
                    extraWrapperClassName={style.inputSearch}
                    handleResetValue={resetSearchParams}
                    placeholder="Поиск"
                    onChange={handleChangeValue}
                    value={valueInputSearch}
                  />
                  <ClearFieldBtn
                    extraAfterChunkClassName={style.clear_btn}
                    onClick={handleClickBtnMore}
                    text-area="закрыть поиск"
                    title="закрыть поиск"
                  />
                </>
              ) : (
                <div className={style.icons}>
                  <CustomButton
                    textBtn={' '}
                    classNameBtn={style.search_btn}
                    onClick={handleClickBtnSearch}
                    text-area="Поиск"
                    title="Поиск"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </CSSTransition>
    </SwitchTransition>
  );
};
export default memo(TopBarChat);

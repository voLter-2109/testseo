import { useQuery } from '@tanstack/react-query';
import classNames from 'classnames';
import {
  ChangeEvent,
  FC,
  memo,
  useCallback,
  useContext,
  useEffect,
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
import { ReactComponent as Cross } from '../../../assets/create-profile/cross.svg';

import { useWindowSize } from '../../../hooks/useWindowSize';

import { ThemeContext } from '../../../providers/ThemeProvider';

import useChatListStore from '../../../store/chatListStore';

import { getContactUserByUid } from '../../../api/contact/contact';
import { GET_USER_BY_UID } from '../../../constant/querykeyConstants';
import { MessageListItem } from '../../../types/chat/messageListItem';

import CustomButton from '../../../ui/custom-button/Button';
import ClearFieldBtn from '../../../ui/inputs/clear-filed-btn/ClearFieldBtn';
import InputSearch from '../../../ui/inputs/input-search/InputSearch';
import Avatar from '../../avatar/Avatar';

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
  const [refetchUserData, setRefetchUserData] = useState(false);
  const nodeRef = useRef<any>(null);

  const navigate = useNavigate();

  const { width } = useWindowSize();
  const theme = useContext(ThemeContext);

  const userList = useChatListStore((state) => state.userList);
  const checkUserListByUid = useChatListStore(
    (state) => state.checkUserListByUid
  );
  const addUserInList = useChatListStore((state) => state.addUserInList);

  const { isOnline, wasOnlineAt } = useChatListStore((state) =>
    state.getOnlineStateByUserUid(uid)
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

  const user = useMemo(() => (uid ? userList[uid] : null), [uid, userList]);

  const { data: userData } = useQuery({
    queryKey: [GET_USER_BY_UID, uid],
    queryFn: () => {
      return getContactUserByUid({
        uid,
      });
    },
    select: (data) => {
      if (data) return data.data;

      return null;
    },
    enabled: refetchUserData,
  });

  useEffect(() => {
    if (Boolean(uid.length) && !checkUserListByUid(uid)) {
      setRefetchUserData(true);
    }
  }, [uid, checkUserListByUid]);

  useEffect(() => {
    if (userData) {
      addUserInList({
        uid: userData.uid,
        userDate: {
          ...userData,
          is_doctor_check: userData.is_doctor,
          is_online: false,
        },
      });
    }
  }, [userData]);

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

  const memoizedCrossIcon = useMemo(
    () => (
      <Cross
        className={classNames(style.btn_svg, {
          [style.lightTheme]: theme?.theme === 'dark',
        })}
      />
    ),
    [theme?.theme]
  );

  const memoizedUnverifiedIcon = useMemo(() => <UnverifiedSvg />, []);
  const memoizedVerifiedIcon = useMemo(
    () => (
      <VerifiedSvg className={style.verifiedIcon} title="Проверенный доктор" />
    ),
    []
  );

  const memoizedAvaterUrl = useMemo(() => {
    if (user && user.avatar_webp_url) {
      return user.avatar_webp_url;
    }

    return user?.avatar_url;
  }, [user?.avatar_url]);

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
  ];

  const memoizedIcons = iconsConfig.map(({ Component, props, deps }) =>
    useMemo(() => <Component {...props} />, deps)
  );

  const [memorizeDeleteIcon, memorizeClearIcon] = memoizedIcons;

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
                <Avatar img={memoizedAvaterUrl} size="small" />
                {!showSearch ? (
                  <div>
                    {user ? (
                      <p>{`${user.last_name} ${user.first_name} ${user.patronymic}`}</p>
                    ) : userData ? (
                      <p>{`${userData.last_name} ${userData.first_name} ${userData.patronymic}`}</p>
                    ) : (
                      <p>Собеседник</p>
                    )}
                    <span className={style.timeOnline}>{titleOnline}</span>
                  </div>
                ) : null}
                {isDoctor &&
                  (isModeratedDoctor
                    ? memoizedVerifiedIcon
                    : memoizedUnverifiedIcon)}
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
                  >
                    {memoizedCrossIcon}
                  </ClearFieldBtn>
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

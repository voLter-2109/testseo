/* eslint-disable @typescript-eslint/naming-convention */

import { useAutoAnimate } from '@formkit/auto-animate/react';
import { FC, useState } from 'react';

import { ContactSuperShortUserInfo } from '../../../types/contact/contact';
import RootBoundaryComponent from '../../../ui/error-component/RootBoundaryComponent';
import OutletLoading from '../../../ui/suspense-loading/OutletLoading';
import Avatar from '../../avatar/Avatar';

import Spinner from '../../../ui/spinner/Spinner';

import style from './BlacklistPopup.module.scss';

interface PropsBlackUserList {
  blUsers: ContactSuperShortUserInfo[];
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  isPending: boolean;
  refreshComponent: () => void;
  refInter: (node?: Element | null) => void;
  handleBlackListDeleteClick: (uid: string) => void;
}

const BlackUserList: FC<PropsBlackUserList> = ({
  blUsers,
  isError,
  refInter,
  isLoading,
  isPending,
  isFetching,
  refreshComponent,
  handleBlackListDeleteClick,
}) => {
  const [selectUser, setSelectUser] = useState<string>('');
  const [listRef] = useAutoAnimate();

  const list = blUsers.map((l) => l.blocked_user);

  if (isError) return <RootBoundaryComponent refreshFunc={refreshComponent} />;
  if (isLoading && isFetching) return <OutletLoading />;

  return (
    <div className={style.blackListWrapper}>
      <h2>Черный список</h2>
      <ul className={style.users} ref={listRef}>
        {list.length ? (
          list.map((user, idx) => {
            const {
              uid,
              last_name,
              first_name,
              patronymic,
              avatar_url,
              avatar_webp_url,
            } = user;
            return (
              <li
                key={uid}
                ref={list.length === idx + 1 ? refInter : null}
                className={style.userWrapper}
              >
                <div className={style.user}>
                  <div className={style.userInfo}>
                    <Avatar img={avatar_webp_url || avatar_url} size="small" />
                    <div className={style.name}>
                      <div>
                        <span>{last_name} </span>
                        <span>{first_name} </span>
                        <span>{patronymic} </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    className={style.del}
                    onClick={(e) => {
                      setSelectUser(uid);
                      e.preventDefault();
                      handleBlackListDeleteClick(uid);
                    }}
                  >
                    {isPending && uid === selectUser ? (
                      <Spinner size="sm" />
                    ) : (
                      <span>Вернуть</span>
                    )}
                  </button>
                </div>
              </li>
            );
          })
        ) : (
          <p className={style.empty}>Вы пока никого не добавили</p>
        )}
        {isFetching && <div>is Loading</div>}
      </ul>
    </div>
  );
};

export default BlackUserList;

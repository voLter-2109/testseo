import classNames from 'classnames';
import { ChangeEvent, FC, useMemo } from 'react';
import { useContextMenu } from 'react-contexify';

import Burger from '../../../ui/burger/Burger';
import InputSearch from '../../../ui/inputs/input-search/InputSearch';

import useUserStore from '../../../store/userStore';

import { ReactComponent as AddSvg } from '../../../assets/side-menu/add_black.svg';

import { ADD_CONTEXT_MENU_ID } from '../../../constant/other-constants';
import CreateChatMenu from '../../menu/CreateChatMenu/CreateChatMenu';

import style from './topBar.module.scss';

type Props = {
  valueInputSearch: string;
  resetSearchValue: () => void;
  setValueInputSearch: (value: string) => void;
};

/**
 *
 * @returns компонент с бургером и поисков в левом навбаре
 * и добавлением каналов/групп/папок
 */

const TopBar: FC<Props> = ({
  setValueInputSearch,
  valueInputSearch,
  resetSearchValue,
}) => {
  const chatSideBar = useUserStore((state) => state.chatSideBar);
  const toggleChatSideBar = useUserStore((state) => state.toggleChatSideBar);

  // функция для обработки в поле поиска
  const handleChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
    setValueInputSearch(e.currentTarget.value);
  };

  // _________________кнопка для открытия меню_____________
  const { show } = useContextMenu({ id: ADD_CONTEXT_MENU_ID });

  const displayMenu = (event: React.MouseEvent<HTMLElement>) => {
    show({
      id: ADD_CONTEXT_MENU_ID,
      event,
      props: {},
    });
  };

  const iconsConfig = [
    {
      Component: AddSvg,
      props: {
        className: classNames(style.addBtn, style.btn),
      },
      deps: [],
    },
  ];

  const memoizedIcons = iconsConfig.map(({ Component, props, deps }) =>
    useMemo(() => <Component {...props} />, deps)
  );

  const [memoizedAddIcon] = memoizedIcons;

  return (
    <>
      <div className={style.topBar}>
        <Burger isOpen={chatSideBar} handleClick={toggleChatSideBar} />

        <div className={style.search}>
          <InputSearch
            handleResetValue={resetSearchValue}
            placeholder="Поиск"
            onChange={(e) => handleChangeValue(e)}
            value={valueInputSearch}
          />
        </div>

        <div className={style.addBtn} onClick={displayMenu}>
          {memoizedAddIcon}
          <CreateChatMenu />
        </div>
      </div>
    </>
  );
};

export default TopBar;

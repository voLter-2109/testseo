import classNames from 'classnames';

import { ChangeEvent, FC, useCallback, useMemo, useRef, useState } from 'react';
import { Item, Menu, useContextMenu } from 'react-contexify';

import Burger from '../../../ui/burger/Burger';
import InputSearch from '../../../ui/inputs/input-search/InputSearch';

import useUserStore from '../../../store/userStore';

import { ReactComponent as AddSvg } from '../../../assets/side-menu/add_black.svg';

import useOutsideClick from '../../../hooks/useOutsideClick';
import { ADD_CONTEXT_MENU_ID } from '../../../constant/other-constants';

import CreateGroupPopup from '../../popups/create-group-popup/CreateGroupPopup';
import CreateChannelPopup from '../../popups/create-channel-popup/CreateChannelPopup';

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
  const [isAddContextMenuOpen, setAddContextMenuOpen] = useState(false);

  const chatSideBar = useUserStore((state) => state.chatSideBar);
  const toggleChatSideBar = useUserStore((state) => state.toggleChatSideBar);

  const handleChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
    setValueInputSearch(e.currentTarget.value);
  };

  const contextMenuRef = useRef<HTMLDivElement>(null);
  const { show } = useContextMenu();

  const hideContextMenu = () => {
    setAddContextMenuOpen(false);
  };

  const toggleAddContextMenu = useCallback(
    (event: React.MouseEvent<SVGSVGElement>) => {
      show({ event, id: ADD_CONTEXT_MENU_ID });
      setAddContextMenuOpen(true);
    },
    [setAddContextMenuOpen, show]
  );

  useOutsideClick(contextMenuRef, hideContextMenu);

  const iconsConfig = [
    {
      Component: AddSvg,
      props: {
        onClick: (e: React.MouseEvent<SVGSVGElement>) => {
          e.preventDefault();
          toggleAddContextMenu(e);
        },
        className: classNames(style.addBtn),
      },
      deps: [toggleAddContextMenu],
    },
  ];

  const memoizedIcons = iconsConfig.map(({ Component, props, deps }) =>
    useMemo(() => <Component {...props} />, deps)
  );

  const [memoizedAddIcon] = memoizedIcons;
  const [openCreateGroupModal, setOpenCreateGroupModal] =
    useState<boolean>(false);

  const toggleViewCreateGroupPopUp = () => {
    setOpenCreateGroupModal((prev) => !prev);
  };

  const handleAddGroup = (groupName: string) => {
    // СОЗДАНИЕ ГРУППЫ ЗДЕСЬ Store
    console.log('Создаем группу: ', groupName);
  };

  const [openCreateChannelModal, setOpenCreateChannelModal] =
    useState<boolean>(false);

  const toggleViewCreateChannelPopUp = () => {
    setOpenCreateChannelModal((prev) => !prev);
  };

  const handleAddChannel = (channelName: string, channelType: string) => {
    // СОЗДАНИЕ КАНАЛА ЗДЕСЬ Store
    console.log(`Создаем канал ${channelName} с типом ${channelType}`);
  };

  const createFolder = () => {
    console.log('Создаем папку');
  };

  return (
    <>
      {openCreateGroupModal && (
        <CreateGroupPopup
          onClose={toggleViewCreateGroupPopUp}
          isOpen={openCreateGroupModal}
          handleAddGroup={(groupName: string) => {
            handleAddGroup(groupName);
          }}
        />
      )}
      {openCreateChannelModal && (
        <CreateChannelPopup
          onClose={toggleViewCreateChannelPopUp}
          isOpen={openCreateChannelModal}
          handleAddChannel={(channelName: string, channelType: string) => {
            handleAddChannel(channelName, channelType);
          }}
        />
      )}
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

        <div ref={contextMenuRef} className={style.addBtn}>
          {memoizedAddIcon}
          <Menu
            id={ADD_CONTEXT_MENU_ID}
            className={classNames(style.contextMenu, {
              [style.contextMenuHide]: !isAddContextMenuOpen,
            })}
          >
            <Item
              onClick={() => {
                hideContextMenu();
                toggleViewCreateGroupPopUp();
              }}
            >
              <span>Создать группу</span>
            </Item>
            <Item
              onClick={() => {
                hideContextMenu();
                toggleViewCreateChannelPopUp();
              }}
            >
              <span>Создать канал</span>
            </Item>
            <Item
              onClick={() => {
                createFolder();
                hideContextMenu();
              }}
            >
              <span>Создать папку</span>
            </Item>
          </Menu>
        </div>
      </div>
    </>
  );
};

export default TopBar;

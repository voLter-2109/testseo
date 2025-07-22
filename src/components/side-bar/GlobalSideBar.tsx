import classNames from 'classnames';
import { FC, PropsWithChildren, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

import CustomButton from '../../ui/custom-button/Button';

import useUserStore from '../../store/userStore';

import style from './sideBar.module.scss';

interface SideBarProps {
  outerContainerId: string;
  extraClassName?: string;
  zIndex?: number;
}

/**
 * @property outerContainerId: string - id внешнего контейнера над которой поместить подложку
 * @returns выезжающее меню
 */

const GlobalSideBar: FC<PropsWithChildren<SideBarProps>> = ({
  children,
  extraClassName,
  outerContainerId,
  zIndex = 100,
}) => {
  const overlayId = useRef<string | null>(null);

  const globalSideBar = useUserStore((state) => state.globalSideBar);
  const toggleGlobalSideBar = useUserStore(
    (state) => state.toggleGlobalSideBar
  );

  const styles = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  };

  useEffect(() => {
    if (outerContainerId && globalSideBar) {
      const container = document.getElementById(outerContainerId);
      if (container) {
        const newDiv = document.createElement('div');
        overlayId.current = uuidv4();
        newDiv.setAttribute('id', overlayId.current);
        newDiv.addEventListener('click', toggleGlobalSideBar);
        Object.assign(newDiv.style, styles);
        container.appendChild(newDiv);
      }
    }

    return () => {
      if (overlayId.current) {
        const elementToRemove = document.getElementById(overlayId.current);
        if (elementToRemove && elementToRemove.parentNode) {
          elementToRemove.parentNode.removeChild(elementToRemove);
          elementToRemove.removeEventListener('click', toggleGlobalSideBar);
        }
      }
    };
  }, [outerContainerId, globalSideBar]);

  return (
    <div
      style={{
        zIndex: `${zIndex + 3}`,
      }}
      className={classNames(style.wrapper, style.right, extraClassName, {
        [style.open]: globalSideBar,
      })}
    >
      <CustomButton
        title="Закрыть"
        textBtn=""
        className={style.cross}
        onClick={toggleGlobalSideBar}
      />
      {children}
    </div>
  );
};

export default GlobalSideBar;

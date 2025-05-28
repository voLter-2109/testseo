import classNames from 'classnames';
import { FC, useContext, useState } from 'react';

import Popup from '../../../ui/popup/Popup';
import { ThemeContext } from '../../../providers/ThemeProvider';

import { ReactComponent as Cross } from '../../../assets/create-profile/cross.svg';
import CustomButton from '../../../ui/custom-button/Button';

import style from './CreateGroupPopup.module.scss';

interface CreateGroupPopupProps {
  isOpen: boolean;
  onClose: () => void;
  handleAddGroup: (groupName: string) => void;
}

const CreateGroupPopup: FC<CreateGroupPopupProps> = ({
  isOpen,
  onClose,
  handleAddGroup,
}) => {
  const theme = useContext(ThemeContext);

  const [groupName, setGroupName] = useState('');

  const handleCreateGroup = async () => {
    try {
      await handleAddGroup(groupName);
    } finally {
      onClose();
    }
  };

  return (
    <>
      {isOpen && (
        <Popup
          extraClass={style.createGroupPopup}
          onClose={onClose}
          isOpen={isOpen}
        >
          <Cross
            className={classNames(style.btn_svg, {
              [style.lightTheme]: theme?.theme === 'dark',
            })}
            onClick={onClose}
          />

          <div className={style.createWrapper}>
            <h2>Введите название группы</h2>
            <input
              type="text"
              name="groupName"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
            <CustomButton
              textBtn="Создать группу"
              styleBtn="primary"
              onClick={handleCreateGroup}
            />
          </div>
        </Popup>
      )}
    </>
  );
};

export default CreateGroupPopup;

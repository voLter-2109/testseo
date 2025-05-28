import classNames from 'classnames';
import { FC, useContext, useState } from 'react';

import Popup from '../../../ui/popup/Popup';
import { ThemeContext } from '../../../providers/ThemeProvider';

import { ReactComponent as Cross } from '../../../assets/create-profile/cross.svg';
import CustomButton from '../../../ui/custom-button/Button';

import style from './CreateChannelPopup.module.scss';

interface CreateChannelPopupProps {
  isOpen: boolean;
  onClose: () => void;
  handleAddChannel: (channelName: string, channelType: string) => void;
}

const CreateChannelPopup: FC<CreateChannelPopupProps> = ({
  isOpen,
  onClose,
  handleAddChannel,
}) => {
  const theme = useContext(ThemeContext);

  const [channelName, setChannelName] = useState('');
  const [channelType, setChannelType] = useState('public');

  const changeType = (e: any) => {
    setChannelType(e.target.value);
  };

  const handleCreateChannel = async () => {
    try {
      await handleAddChannel(channelName, channelType);
    } finally {
      onClose();
    }
  };

  return (
    <>
      {isOpen && (
        <Popup
          extraClass={style.createChannelPopup}
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
            <h2>Введите название канала</h2>
            <input
              type="text"
              name="channelName"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
            />
            <div className={style.typeControl}>
              <p>
                <input
                  className={style.control}
                  type="radio"
                  name="channelType"
                  value="public"
                  onChange={changeType}
                  defaultChecked
                />
                Публичный канал
              </p>

              <p>
                <input
                  className={style.control}
                  type="radio"
                  name="channelType"
                  value="private"
                  onChange={changeType}
                />
                Частный канал
              </p>
            </div>
            <CustomButton
              textBtn="Создать канал"
              styleBtn="primary"
              onClick={handleCreateChannel}
            />
          </div>
        </Popup>
      )}
    </>
  );
};

export default CreateChannelPopup;

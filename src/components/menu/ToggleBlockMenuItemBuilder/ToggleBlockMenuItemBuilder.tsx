import { Item, ItemParams } from 'react-contexify';

const ToggleBlockMenuItemBuilder = (
  itemClass: string,
  contentClass: string,
  icon: JSX.Element,
  labels: [string, string],
  handleClick: ({ props }: ItemParams) => void
) => {
  return [
    <Item
      key="uid-false"
      hidden={({ props }) => {
        const { blockChat } = props;
        return blockChat;
      }}
      onClick={handleClick}
      className={itemClass}
    >
      <div className={contentClass}>
        {icon}
        <span>{labels[0]}</span>
      </div>
    </Item>,
    <Item
      key="uid-true"
      hidden={({ props }) => {
        const { blockChat } = props;
        return !blockChat;
      }}
      onClick={handleClick}
      className={itemClass}
    >
      <div className={contentClass}>
        {icon}
        <span>{labels[1]}</span>
      </div>
    </Item>,
  ];
};

export default ToggleBlockMenuItemBuilder;

import { Item, ItemParams, BooleanPredicate } from 'react-contexify';

const ToggleMenuItemBuilder = (
  itemClass: string,
  contentClass: string,
  field: string,
  icon: JSX.Element,
  labels: [string, string],
  onClick: (args: ItemParams<any>) => void
) => {
  const hideIfTrue: BooleanPredicate = ({ props }) => !props?.[field];
  const hideIfFalse: BooleanPredicate = ({ props }) => !!props?.[field];

  return [
    <Item
      key={`${field}-false`}
      hidden={hideIfTrue}
      onClick={onClick}
      className={itemClass}
    >
      <div className={contentClass}>
        {icon}
        <span>{labels[0]}</span>
      </div>
    </Item>,
    <Item
      key={`${field}-true`}
      hidden={hideIfFalse}
      onClick={onClick}
      className={itemClass}
    >
      <div className={contentClass}>
        {icon}
        <span>{labels[1]}</span>
      </div>
    </Item>,
  ];
};

export default ToggleMenuItemBuilder;

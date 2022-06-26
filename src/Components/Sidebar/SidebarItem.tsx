import Tooltip from 'rc-tooltip';
import { BiSquare } from 'react-icons/bi';
import { FaPencilAlt, FaTextHeight } from 'react-icons/fa';
import { IconType } from 'react-icons/lib';
import { MenuItem, SubMenu } from 'react-pro-sidebar';
import styled from 'styled-components';
import { IDrawAction } from '../../Types/Common';
import TooltipContainer from '../Tooltip/Tooltip';

export interface ISidebarItem {
  id: string;
  name: string;
  icon: React.ReactElement;
  action?: IDrawAction;
  items?: ISidebarItem[];
}

interface ISidebarItemProps {
  name: string;
  icon: React.ReactElement;
  active?: boolean;
  onClick: ()=>void
}

function SidebarItem({
  name, icon, active, onClick,
}: ISidebarItemProps): JSX.Element {
  return (
    <Tooltip overlay={<TooltipContainer>{name}</TooltipContainer>}>
      <MenuItem
        onClick={onClick || null}
        active={active}
        icon={icon}
        popperarrow
      >
        {name}
      </MenuItem>
    </Tooltip>
  );
}

const LabelContainer = styled.div`
  padding-right: 20px;
  color: #f53b57;
  font-size: 1rem;
  font-weight: bold;
  margin: 0.2rem 0;
  text-align: center;
`;

export interface ISidebarItemsContainer extends ISidebarItem {
  isActive?: boolean;
  onClick: (item: ISidebarItem) => void;
}
const SidebarItemsContainer = ({ onClick, ...props }: ISidebarItemsContainer): JSX.Element => {
  const { items, isActive } = props;
  if (!items) {
    return (
      <SidebarItem
        {...props}
        active={isActive}
        onClick={() => onClick(props)}
      />
    );
  }

  const { name, icon } = props;

  return (
    <SubMenu
      {...props}
      title={name}
      icon={icon}
    >
      <LabelContainer>
        {name}
      </LabelContainer>
      {items.map((item, subIndex) => (
        <SidebarItem
          key={subIndex}
          name={item.name}
          icon={item.icon}
          active={isActive}
          onClick={() => onClick(item)}
        />
      ))}
    </SubMenu>
  );
};

export default SidebarItemsContainer;

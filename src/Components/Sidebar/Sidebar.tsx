import {
  ProSidebar, SidebarHeader, Menu, MenuItem,
} from 'react-pro-sidebar';
import styled from 'styled-components';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faBrush, faLineChart } from '@fortawesome/free-solid-svg-icons';
import Tooltip from 'rc-tooltip';
import TooltipContainer from '../Tooltip/Tooltip';
import SidebarItemsContainer from './SidebarItem';
import { IDrawAction } from '../../Types/Common';
import logo from '../../Assets/logo.png';
import 'react-pro-sidebar/dist/css/styles.css';

export interface ISidebarItem {
  id: string;
  name: string;
  icon: IconProp;
  action?: IDrawAction;
  items?: ISidebarItem[];
}
const items: ISidebarItem[] = [
  {
    id: 'brush',
    name: 'Brush',
    icon: faBrush,
  },
  {
    id: 'line',
    name: 'Line',
    icon: faLineChart,
  },
];

const Container = styled.div`
  position: relative;
  display: flex;
  height: 100vh;
  background-color: #ddddff;
  box-shadow: 1px 3px 6px #00000040;
`;

function Sidebar(): JSX.Element {
  const handleItemOnClick = (item: ISidebarItem): void => {
    console.log('item', item);
  };
  const handleColorClick = (): void => {
    console.log(currentColor);
  };

  const currentColor = '#6c5ce7';

  const sidebarItems = items.map((item, index) => (
    <SidebarItemsContainer key={index} {...item} onClick={handleItemOnClick} />
  ));

  return (
    <Container>
      <ProSidebar width="240px" collapsed color="#2d3436">
        <SidebarHeader>
          <div style={{ textAlign: 'center', paddingTop: '0.4rem', paddingBottom: '0.2rem' }}>
            <img
              src={logo}
              style={{ width: '32px', height: '40px' }}
              alt={logo}
            />
          </div>
        </SidebarHeader>
        <Menu iconShape="round">
          {sidebarItems}

          <div style={{ height: '8px', marginBottom: '8px', borderBottom: '1px solid #636e7250' }} />

          <Tooltip overlay={<TooltipContainer>Color picker</TooltipContainer>}>
            <MenuItem
              onClick={handleColorClick}
              icon={<div style={{ width: '100%', height: '100%', backgroundColor: currentColor }} />}
              popperarrow
            >
              Color picker
            </MenuItem>
          </Tooltip>
        </Menu>
      </ProSidebar>
    </Container>
  );
}

export default Sidebar;

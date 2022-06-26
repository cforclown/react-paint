import {
  ProSidebar, SidebarHeader, Menu, MenuItem,
} from 'react-pro-sidebar';
import styled from 'styled-components';
import Tooltip from 'rc-tooltip';
import { useDispatch, useSelector } from 'react-redux';
import { useMemo } from 'react';
import {
  BiSquare, BiBox, BiCircle, BiShapeTriangle,
} from 'react-icons/bi';
import {
  FaPencilAlt, FaTextHeight, FaMinus, FaEllipsisH,
} from 'react-icons/fa';
import { IState } from '../../Reducer/Reducer';
import { ChangeTool, ShowOrHideColorPicker } from '../../Reducer/Actions';
import { isToolType, ToolType } from '../Canvas/Canvas.service';
import TooltipContainer from '../Tooltip/Tooltip';
import SidebarItemsContainer, { ISidebarItem } from './SidebarItem';
// import items from './SidebarItems';
import logo from '../../Assets/logo.png';
import 'react-pro-sidebar/dist/css/styles.css';

const items: ISidebarItem[] = [
  {
    id: 'selection',
    name: 'Selection',
    icon: <BiBox />,
  },
  {
    id: 'line',
    name: 'Line',
    icon: <FaMinus />,
  },
  {
    id: 'rectangle',
    name: 'Rectangle',
    icon: <BiSquare />,
  },
  {
    id: 'rectangle',
    name: 'Triangle',
    icon: <BiShapeTriangle />,
  },
  {
    id: 'rectangle',
    name: 'Circle',
    icon: <BiCircle />,
  },
  {
    id: 'rectangle',
    name: 'Ellipse',
    icon: <FaEllipsisH />,
  },
  {
    id: 'pencil',
    name: 'Pencil',
    icon: <FaPencilAlt />,
  },
  {
    id: 'text',
    name: 'Text',
    icon: <FaTextHeight />,
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
  const dispatch = useDispatch();
  const currentTool = useSelector<IState>((state) => state.tool) as string;
  const currentColor = useSelector<IState>((state) => state.color) as string;

  const handleItemOnClick = (item: ISidebarItem): void => {
    if (!isToolType(item.id)) {
      return;
    }
    dispatch(ChangeTool(item.id as ToolType));
  };

  const handleColorClick = (): void => {
    dispatch(ShowOrHideColorPicker(true));
  };

  const sidebarItems = useMemo(() => items.map((item, index) => (
    <SidebarItemsContainer key={index} {...item} onClick={handleItemOnClick} isActive={item.id === currentTool} />
  )), [currentTool]);

  return (
    <Container>
      <ProSidebar width="240px" collapsed color="red" style={{ backgroundColor: 'red' }}>
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

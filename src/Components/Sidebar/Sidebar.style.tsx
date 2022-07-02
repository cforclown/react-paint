import styled from 'styled-components';
import SidebarBase from './Sidebar';

const Sidebar = styled(SidebarBase)`
  position: relative;
  display: flex;
  height: 100vh;
  background-color: #ddddff;
  box-shadow: 2px 0px 3px #00000040;

  .image-uploader {
    position: absolute;
    right: 0;
    bottom: 0;
    height: 0;
    width: 0;
    margin: 0;
    padding: 0;
    display: none;
  }
`;

export default Sidebar;

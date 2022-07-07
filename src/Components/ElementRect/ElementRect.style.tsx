import styled from 'styled-components';
import ElementRectBase, { IElementRectProps } from './ElementRect';

const ElementRect = styled(ElementRectBase)<IElementRectProps>`
  position: absolute;
  border: 1px solid #8d979b80;
  /* cursor: move; */

  .controller {
    position: absolute;
    width: 12px;
    height: 12px;
    outline: 1px solid #8d979b80;
  }

  .top-left {
    left: -6px;
    top: -6px;
    cursor: nw-resize;
  }

  .top-center {
    cursor: n-resize;
  }

  .top-right {
    right: -6px;
    top: -6px;
    cursor: ne-resize;
  }

  .center-left {
    cursor: ew-resize;
  }

  .center-center {
    cursor: move;
  }

  .center-right {
    cursor: e-resize;
  }

  .bottom-left {
    left: -6px;
    bottom: -6px;
    cursor: sw-resize;
  }

  .bottom-center {
    cursor: s-resize;
  }

  .bottom-right {
    right: -6px;
    bottom: -6px;
    cursor: se-resize;
  } 
`;
ElementRect.displayName = 'ElementRect';

export default ElementRect;

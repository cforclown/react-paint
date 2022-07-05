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
    left: ${(props) => props.elementRect.width / 2 - 6}px;
    top: -6px;
    cursor: n-resize;
  }

  .top-right {
    left: ${(props) => props.elementRect.width - 6}px;
    top: -6px;
    cursor: ne-resize;
  }

  .center-left {
    left: -6px;
    top: ${(props) => props.elementRect.height / 2 - 6}px;
    cursor: ew-resize;
  }

  .center-center {
    left: ${(props) => props.elementRect.width / 2 - 6}px;
    top: ${(props) => props.elementRect.height / 2 - 6}px;
    cursor: move;
  }

  .center-right {
    left: ${(props) => props.elementRect.width - 6}px;
    top: ${(props) => props.elementRect.height / 2 - 6}px;
    cursor: e-resize;
  }

  .bottom-left {
    left: -6px;
    top: ${(props) => props.elementRect.height - 6}px;
    cursor: sw-resize;
  }

  .bottom-center {
    left: ${(props) => props.elementRect.width / 2 - 6}px;
    top: ${(props) => props.elementRect.height - 6}px;
    cursor: s-resize;
  }

  .bottom-right {
    left: ${(props) => props.elementRect.width - 6}px;
    top: ${(props) => props.elementRect.height - 6}px;
    cursor: se-resize;
  } 
`;
ElementRect.displayName = 'ElementRect';

export default ElementRect;

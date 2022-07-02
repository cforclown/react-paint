import styled from 'styled-components';
import CanvasBase from './Canvas';

const Canvas = styled(CanvasBase)`
  width: 100%;
  height: 100%;
  padding: 1rem 0 0 1rem;
  overflow: auto;

  .canvas-container {
    width: 100%;
    height: 100%;
    > canvas {
      background-color: white;
      box-shadow: 0px 0px 6px #00000080;
    }
  }

  .text-area {
    border: 1px solid #b2bec3;
  }
`;

export default Canvas;

import styled from 'styled-components';
import { IRect, TypeElement } from '../../Utils/Element/Element.service';
import { getElementRect } from '../Canvas/Canvas.service';

const Container = styled.div`
  position: absolute;
  border: 1px solid gray;
`;

interface IElementRectProps {
  element: TypeElement;
  canvasOffset: {
    x: number;
    y: number
  },
  onCanvasMouseDown: React.MouseEventHandler<HTMLCanvasElement>;
  onCanvasMouseMove: React.MouseEventHandler<HTMLCanvasElement>;
  onCanvasMouseUp: React.MouseEventHandler<HTMLCanvasElement>;
}
function ElementRect({
  element,
  canvasOffset,
  onCanvasMouseDown,
  onCanvasMouseMove,
  onCanvasMouseUp,
}: IElementRectProps): JSX.Element {
  const elementRect = getElementRect({ ...element }) as unknown as IRect;
  return (
    <Container
      style={{
        left: elementRect.x + canvasOffset.x,
        top: elementRect.y + canvasOffset.y,
        width: elementRect.width,
        height: elementRect.height,
      }}
      onMouseDown={(e) => onCanvasMouseDown(e as unknown as React.MouseEvent<HTMLCanvasElement>)}
      onMouseMove={(e) => onCanvasMouseMove(e as unknown as React.MouseEvent<HTMLCanvasElement>)}
      onMouseUp={(e) => onCanvasMouseUp(e as unknown as React.MouseEvent<HTMLCanvasElement>)}
    />
  );
}

export default ElementRect;

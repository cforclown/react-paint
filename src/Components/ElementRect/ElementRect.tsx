import styled from 'styled-components';
import { getElementRect, IElementRect, TypeElement } from '../Canvas/Canvas.service';

const Container = styled.div`
  position: absolute;
  border: 1px solid gray;
`;

interface IElementRectProps {
  element: TypeElement;
  canvasOffset: {
    x: number;
    y: number
  }
}
function ElementRect({ element, canvasOffset }: IElementRectProps): JSX.Element {
  const elementRect = getElementRect(element) as unknown as IElementRect;
  return (
    <Container
      style={{
        left: elementRect.x + canvasOffset.x,
        top: elementRect.y + canvasOffset.y,
        width: elementRect.width,
        height: elementRect.height,
      }}
    />
  );
}

export default ElementRect;

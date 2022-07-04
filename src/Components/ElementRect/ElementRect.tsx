import { useEffect, useState } from 'react';
import {
  IImageElement, IPencilElement, IPoint, IRect, IShapeElement, ITextElement, TypeElement,
} from '../../Utils/Element/Element.service';
import {
  adjustElementCoordinates, adjustmentRequired, getElementAtPosition,
} from '../Canvas/Canvas.service';
import {
  ResizeAction, resizedCoordinates, SelectionToolAction,
} from './ElementRect.service';

function getMousePos(event: MouseEvent, canvasOffset: IPoint): IPoint {
  return {
    x: event.clientX - canvasOffset.x,
    y: event.clientY - canvasOffset.y,
  };
}

export interface IElementRectProps {
  element: TypeElement;
  elementRect: IRect;
  setElement: (element: TypeElement) => void;
  onEdit: (element: TypeElement, params?: Record<string, any>) => void;
  canvasOffset: {
    x: number;
    y: number
  },
  className?: string;
}

function ElementRectBase({
  element,
  elementRect,
  setElement,
  onEdit,
  canvasOffset,
  className,
}: IElementRectProps): JSX.Element {
  const [action, setAction] = useState<SelectionToolAction>('none');
  const [resizeAction, _setResizeAction] = useState<ResizeAction>('none');
  const setResizeAction = (resize: ResizeAction): void => {
    _setResizeAction(resize);
    setAction('resizing');
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  });

  const handleMouseDown = (mouseEvent: MouseEvent): void => {
    const mousePos = getMousePos(mouseEvent, canvasOffset);

    const currentElement = getElementAtPosition(mousePos, [element]);
    if (!currentElement) {
      return;
    }

    if (resizeAction !== 'none') {
      setAction('resizing');
    } else {
      setAction('moving');
    }

    if (element.type === 'pencil') {
      const xOffsets = element.points.map((point) => mousePos.x - point.x);
      const yOffsets = element.points.map((point) => mousePos.y - point.y);
      setElement({ ...element, xOffsets, yOffsets });
    } else {
      const offsetX = mousePos.x - element.x1;
      const offsetY = mousePos.y - element.y1;
      setElement({ ...element, offsetX, offsetY });
    }
  };

  const handleMouseMove = (mouseEvent: MouseEvent): void => {
    if (action === 'none') {
      return;
    }

    const mousePos = getMousePos(mouseEvent, canvasOffset);

    const currentElement = { ...element };
    if (action === 'moving') {
      if (element.type === 'pencil') {
        const newPoints = (currentElement as IPencilElement).points.map((_, index) => ({
          x: mousePos.x - (currentElement as IPencilElement).xOffsets[index],
          y: mousePos.y - (currentElement as IPencilElement).yOffsets[index],
        }));
        (currentElement as IPencilElement).points = newPoints;
        onEdit(currentElement);
      } else {
        const {
          x1, x2, y1, y2, type, offsetX, offsetY,
        } = currentElement as IShapeElement | ITextElement | IImageElement;
        const width = x2 - x1;
        const height = y2 - y1;
        currentElement.x1 = mousePos.x - offsetX;
        currentElement.y1 = mousePos.y - offsetY;
        currentElement.x2 = currentElement.x1 + width;
        currentElement.y2 = currentElement.y1 + height;
        const options = type === 'text' ? { text: (currentElement as ITextElement).text } : {};
        onEdit(currentElement, options);
      }
    } else if (action === 'resizing' && resizeAction !== 'none') {
      const newCoordinates = resizedCoordinates(mousePos, currentElement, resizeAction);
      if (!newCoordinates) {
        return;
      }
      currentElement.x1 = newCoordinates.x1;
      currentElement.y1 = newCoordinates.y1;
      currentElement.x2 = newCoordinates.x2;
      currentElement.y2 = newCoordinates.y2;
      onEdit(currentElement);
    }
  };

  const handleMouseUp = (): void => {
    if (action === 'none') {
      return;
    }

    const currentElement = { ...element };
    if (action === 'resizing' && adjustmentRequired(currentElement.type)) {
      const {
        x1, y1, x2, y2,
      } = adjustElementCoordinates(currentElement);
      currentElement.x1 = x1;
      currentElement.y1 = y1;
      currentElement.x2 = x2;
      currentElement.y2 = y2;
      onEdit(currentElement);
    }

    setAction('none');
    setResizeAction('none');
  };

  const controllers = element.type !== 'pencil' ? (
    <>
      <div className="controller top-left" onMouseDown={() => setResizeAction('nw-resize')} />
      <div className="controller top-center" onMouseDown={() => setResizeAction('n-resize')} />
      <div className="controller top-right" onMouseDown={() => setResizeAction('ne-resize')} />
      <div className="controller center-left" onMouseDown={() => setResizeAction('w-resize')} />
      <div className="controller center-center" onMouseDown={() => setAction('moving')} />
      <div className="controller center-right" onMouseDown={() => setResizeAction('e-resize')} />
      <div className="controller bottom-left" onMouseDown={() => setResizeAction('sw-resize')} />
      <div className="controller bottom-center" onMouseDown={() => setResizeAction('s-resize')} />
      <div className="controller bottom-right" onMouseDown={() => setResizeAction('se-resize')} />
    </>
  ) : undefined;

  return (
    <div
      className={className}
      style={{
        left: elementRect.x + canvasOffset.x,
        top: elementRect.y + canvasOffset.y,
        width: elementRect.width,
        height: elementRect.height,
      }}
      // onMouseDown={handleMouseDown}
      // onMouseMove={handleMouseMove}
      // onMouseUp={handleMouseUp}
    >
      {controllers}
    </div>
  );
}

export default ElementRectBase;

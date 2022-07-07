import { useEffect, useRef, useState } from 'react';
import { IPoint, IRect } from '../../Utils/Common';
import Element from '../../Utils/Element/Element';
import Pencil from '../../Utils/Element/Pencil/Pencil';
import {
  ResizeAction, SelectionToolAction,
} from './ElementRect.service';

function getMousePos(event: MouseEvent, canvasOffset: IPoint): IPoint {
  return {
    x: event.clientX - canvasOffset.x,
    y: event.clientY - canvasOffset.y,
  };
}

export interface IElementRectProps {
  element: Element;
  elementRect: IRect;
  setElement: (element: Element) => void;
  onEdit: (element: Element) => void;
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
  const rectRef = useRef<HTMLDivElement>(null);
  const [action, setAction] = useState<SelectionToolAction>('none');
  const [resizeAction, _setResizeAction] = useState<ResizeAction>('none');
  const [mouseOffset, setMouseOffset] = useState<IPoint | IPoint[] | undefined>(undefined);
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
    if (!element.isHover(mousePos)) {
      return;
    }

    if (resizeAction !== 'none') {
      setAction('resizing');
    } else {
      setAction('moving');
    }

    setMouseOffset(element.type === 'pencil' ? (element as Pencil).points.map((p) => ({
      x: mousePos.x - p.x,
      y: mousePos.y - p.y,
    })) : {
      x: mousePos.x - element.rect.x,
      y: mousePos.y - element.rect.y,
    });
  };

  const handleMouseMove = (mouseEvent: MouseEvent): void => {
    const mousePos = getMousePos(mouseEvent, canvasOffset);
    if (rectRef && rectRef.current) {
      rectRef.current.style.cursor = element.isHover(mousePos) ? 'move' : 'default';
    }

    if (action === 'none' || !mouseOffset) {
      return;
    }

    const currentElement = Object.create(element) as Element;
    if (action === 'moving') {
      currentElement.move(mousePos, mouseOffset);
      onEdit(currentElement);
    } else if (action === 'resizing' && resizeAction !== 'none' && !Array.isArray(mouseOffset)) {
      currentElement.resize(resizeAction, mousePos);
      onEdit(currentElement);
    }
  };

  const handleMouseUp = (): void => {
    if (action === 'none') {
      return;
    }

    const currentElement = Object.create(element) as Element;
    if (action === 'resizing') {
      currentElement.adjustRect();
      onEdit(currentElement);
    }
    setAction('none');
    setResizeAction('none');
  };

  // for better performance some of the positions is placed here, not in .style.tsx file
  const controllers = element.type !== 'pencil' ? (
    <>
      <div className="controller top-left" onMouseDown={() => setResizeAction('nw-resize')} />
      <div
        className="controller top-center"
        onMouseDown={() => setResizeAction('n-resize')}
        style={{
          left: `${elementRect.width / 2 - 6}px`,
          top: '-6px',
        }}
      />
      <div className="controller top-right" onMouseDown={() => setResizeAction('ne-resize')} />
      <div
        className="controller center-left"
        onMouseDown={() => setResizeAction('w-resize')}
        style={{
          left: '-6px',
          top: `${elementRect.height / 2 - 6}px`,
        }}
      />
      <div
        className="controller center-center"
        onMouseDown={() => setAction('moving')}
        style={{
          left: `${elementRect.width / 2 - 6}px`,
          top: `${elementRect.height / 2 - 6}px`,
        }}
      />
      <div
        className="controller center-right"
        onMouseDown={() => setResizeAction('e-resize')}
        style={{
          right: '-6px',
          top: `${elementRect.height / 2 - 6}px`,
        }}
      />
      <div className="controller bottom-left" onMouseDown={() => setResizeAction('sw-resize')} />
      <div
        className="controller bottom-center"
        onMouseDown={() => setResizeAction('s-resize')}
        style={{
          left: `${elementRect.width / 2 - 6}px`,
          bottom: '-6px',
        }}
      />
      <div className="controller bottom-right" onMouseDown={() => setResizeAction('se-resize')} />
    </>
  ) : undefined;

  return (
    <div
      ref={rectRef}
      className={className}
      style={{
        left: elementRect.x + canvasOffset.x,
        top: elementRect.y + canvasOffset.y,
        width: elementRect.width,
        height: elementRect.height,
      }}
    >
      {controllers}
    </div>
  );
}

export default ElementRectBase;

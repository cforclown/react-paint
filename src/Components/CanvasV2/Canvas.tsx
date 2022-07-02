import React, {
  useEffect, useLayoutEffect, useRef, useState,
} from 'react';
import { useSelector } from 'react-redux';
import rough from 'roughjs/bin/rough';
import { RoughGenerator } from 'roughjs/bin/generator';
import {
  drawElement,
  getElementAtPosition,
  resizedCoordinates,
  cursorForPosition,
  adjustmentRequired,
  adjustElementCoordinates,
} from './Canvas.service';
import {
  isElementType,
  createElement,
  ElementType,
  TypeElement,
  PositionType,
  ILineElement,
  IRectangleElement,
  ITextElement,
  isShapeElementType,
  IPoint,
} from '../../Utils/Element/Element.service';
import { IState } from '../../Reducer/Reducer';
// import ElementRect from '../ElementRect/ElementRect';

function getMousePosition(mouseEvent: React.MouseEvent<HTMLCanvasElement>, canvasRect: DOMRect): { mouseX: number; mouseY: number; } {
  const { clientX, clientY } = mouseEvent;
  return {
    mouseX: clientX - canvasRect.left,
    mouseY: clientY - canvasRect.top,
  };
}
function getMousePoint(mouseEvent: React.MouseEvent<HTMLCanvasElement>, canvasRect: DOMRect): IPoint {
  const { clientX, clientY } = mouseEvent;
  return {
    x: clientX - canvasRect.left,
    y: clientY - canvasRect.top,
  };
}

interface ICanvas {
  roughGeneratopr: RoughGenerator,
  elements: any[];
  setElements: (state: any, overwrite?: boolean | undefined) => void;
  undo: () => void;
  redo: () => void;
  selectedElement: TypeElement | null;
  setSelectedElement: (element: TypeElement | null) => void;
  className?: string;
}

function CanvasBase({
  roughGeneratopr: generator, elements, setElements, undo, redo, selectedElement, setSelectedElement, className,
}: ICanvas): JSX.Element {
  const {
    tool, toolOptions, canvasSize, color,
  } = useSelector<IState>((state) => state) as IState;
  const [action, setAction] = useState('none');
  const [canvasRect, setCanvasRect] = useState<DOMRect>();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement | null;
    if (!canvas) {
      return;
    }
    const context = canvas?.getContext('2d');
    if (!context) {
      return;
    }
    context.clearRect(0, 0, canvas.width, canvas.height);

    const roughCanvas = rough.canvas(canvas);

    elements.forEach((element) => {
      try {
        if (action === 'writing' && selectedElement && selectedElement.id === element.id) {
          return;
        }
        drawElement(roughCanvas, context, element);
      } catch (err) {
        if (err instanceof Error) {
          // eslint-disable-next-line no-console
          console.error(err.message);
        }
      }
    });
  }, [elements, action, selectedElement, canvasSize]);

  useEffect(() => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement | null;
    if (!canvas) {
      return;
    }
    setCanvasRect(canvas.getBoundingClientRect());
  }, []);

  useEffect(() => {
    const undoRedoFunction = (event: KeyboardEvent): void => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'z') {
        if (event.shiftKey) {
          redo();
        } else {
          undo();
        }
      }
    };

    document.addEventListener('keydown', undoRedoFunction);
    return () => {
      document.removeEventListener('keydown', undoRedoFunction);
    };
  }, [undo, redo]);

  useEffect(() => {
    const textArea = textAreaRef.current;
    if (action === 'writing' && textArea && selectedElement && selectedElement.type === 'text') {
      textArea.focus();
      textArea.value = selectedElement.text;
    }
  }, [action, selectedElement]);

  const updateElement = (id: number, type: ElementType, x1: number, y1: number, x2?: number, y2?: number, options?: { text?: string }): void => {
    const elementsCopy = [...elements];
    try {
      if (isShapeElementType(type)) {
        if (!x2 || !y2) {
          throw new Error('updateElement: x2 and y2 is undefined');
        }
        elementsCopy[id] = createElement(generator, id, type, x1, y1, x2, y2, elementsCopy[id].color, elementsCopy[id].options ?? {});
      } else if (type === 'pencil') {
        elementsCopy[id].points = [...elementsCopy[id].points, { x: x2, y: y2 }];
        elementsCopy[id].color = color;
      } else if (type === 'text') {
        const canvasElement = document.getElementById('canvas') as HTMLCanvasElement | null;
        if (!canvasElement) {
          throw new Error('UPDATE ELEMENT: canvas element not found');
        }
        const canvasContext = canvasElement.getContext('2d');
        if (!canvasContext) {
          throw new Error('UPDATE ELEMENT: canvas context not found');
        }
        const text = options && options.text ? options.text : '';
        const textWidth = canvasContext.measureText(text).width;
        const textHeight = 24;
        elementsCopy[id] = {
          ...createElement(generator, id, type, x1, y1, x1 + textWidth, y1 + textHeight, elementsCopy[id].color, toolOptions[type]),
          text,
        };
      } else if (type === 'image') {
        if (!x2 || !y2) {
          throw new Error('UPDATE_ELEMENT: type: image ERROR: x2 and y2 is undefined');
        }
        elementsCopy[id] = createElement(generator, id, type, x1, y1, x2, y2, elementsCopy[id].color, elementsCopy[id].options ?? {}, elementsCopy[id].image);
      } else {
        throw new Error(`Type not recognised: ${type}`);
      }
    } catch (err) {
      if (err instanceof Error) {
        // eslint-disable-next-line no-console
        console.error('UPDATE ELEMENT:', err.message);
      }
    }

    setElements(elementsCopy, true);
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>): void => {
    if (!canvasRect || action === 'writing') {
      return;
    }

    const mousePos = getMousePoint(event, canvasRect);
    if (tool === 'selection') {
      const element = getElementAtPosition(mousePos, elements);
      if (!element) {
        return;
      }
      if (element.type === 'pencil') {
        const xOffsets = element.points.map((point) => mousePos.x - point.x);
        const yOffsets = element.points.map((point) => mousePos.y - point.y);
        setSelectedElement({ ...element, xOffsets, yOffsets });
      } else {
        const offsetX = mousePos.x - element.x1;
        const offsetY = mousePos.y - element.y1;
        setSelectedElement({ ...element, offsetX, offsetY });
      }
      setElements((prevState: any) => prevState);

      if (element.position === 'inside') {
        setAction('moving');
      } else {
        setAction('resizing');
      }
    } else if (isElementType(tool)) {
      const id = elements.length;
      const element = createElement(generator, id, tool as ElementType, mousePos.x, mousePos.y, mousePos.x, mousePos.y, color, toolOptions[tool]);
      if (!element) {
        return;
      }
      setElements((prevState: any) => [...prevState, element]);
      setSelectedElement(element);
      setAction(tool === 'text' ? 'writing' : 'drawing');
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>): void => {
    if (!canvasRect) {
      return;
    }

    const mousePos = getMousePoint(event, canvasRect);
    if (tool === 'selection') {
      const element = getElementAtPosition(mousePos, elements);
      // eslint-disable-next-line no-param-reassign
      event.currentTarget.style.cursor = element ? cursorForPosition(element.position as PositionType) : 'default';
    }

    if (action === 'drawing') {
      const index = elements.length - 1;
      const { x1, y1 } = elements[index];
      updateElement(index, tool as ElementType, x1, y1, mousePos.x, mousePos.y);
    } else if (action === 'moving') {
      if (!selectedElement) {
        return;
      }

      if (selectedElement.type === 'pencil') {
        const newPoints = selectedElement.points.map((_, index) => ({
          x: mousePos.x - selectedElement.xOffsets[index],
          y: mousePos.y - selectedElement.yOffsets[index],
        }));
        const elementsCopy = [...elements];
        elementsCopy[selectedElement.id] = {
          ...elementsCopy[selectedElement.id],
          points: newPoints,
        };
        setElements(elementsCopy, true);
      } else {
        const {
          id, x1, x2, y1, y2, type, offsetX, offsetY,
        } = selectedElement;
        const width = x2 - x1;
        const height = y2 - y1;
        const newX1 = mousePos.x - offsetX;
        const newY1 = mousePos.y - offsetY;
        const options = type === 'text' ? { text: selectedElement.text } : {};
        updateElement(id, type, newX1, newY1, newX1 + width, newY1 + height, options);
      }
    } else if (action === 'resizing') {
      if (!selectedElement) {
        return;
      }
      if (selectedElement.type === 'pencil') {
        return;
      }
      const {
        id, type, position, ...coordinates
      } = selectedElement;
      const newCoordinates = resizedCoordinates(mousePos.x, mousePos.y, coordinates, position);
      if (newCoordinates) {
        updateElement(id, type, newCoordinates.x1, newCoordinates.y1, newCoordinates.x2, newCoordinates.y2);
      }
    }
  };

  const handleMouseUp = (event: React.MouseEvent<HTMLCanvasElement>): void => {
    if (!canvasRect) {
      return;
    }

    const { mouseX, mouseY } = getMousePosition(event, canvasRect);
    if (selectedElement) {
      if (
        selectedElement.type === 'text'
        && mouseX - selectedElement.offsetX === selectedElement.x1
        && mouseY - selectedElement.offsetY === selectedElement.y1
      ) {
        setAction('writing');
        return;
      }

      const index = selectedElement.id;
      const { id, type } = elements[index];
      if ((action === 'drawing' || action === 'resizing') && adjustmentRequired(type)) {
        const {
          x1, y1, x2, y2,
        } = adjustElementCoordinates(elements[index]);
        updateElement(id, type, x1, y1, x2, y2);
      }
    }

    if (action === 'writing') {
      return;
    }

    setAction('none');
    setSelectedElement(null);
  };

  const handleBlur = (event: React.FocusEvent<HTMLTextAreaElement>): void => {
    if (!selectedElement) {
      return;
    }

    const {
      id, type, x1, y1,
    } = selectedElement as ILineElement | IRectangleElement | ITextElement;
    setAction('none');
    setSelectedElement(null);
    updateElement(id, type, x1, y1, undefined, undefined, { text: event.target.value });
  };

  return (
    <div className={className}>
      <div className="canvas-container" id="canvas-container">
        {(action === 'writing' && selectedElement && selectedElement.type !== 'pencil') ? (
          <textarea
            className="text-area"
            ref={textAreaRef}
            onBlur={handleBlur}
            style={{
              position: 'fixed',
              top: selectedElement.y1 - 2,
              left: selectedElement.x1,
              font: '24px sans-serif',
              margin: 0,
              padding: 0,
              outline: 0,
              // resize: 'auto',
              resize: 'both',
              overflow: 'hidden',
              whiteSpace: 'pre',
              background: 'transparent',
            }}
          />
        ) : null}
        <canvas
          id="canvas"
          width={canvasSize.width}
          height={canvasSize.height}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          Canvas
        </canvas>
        {/* {tool === 'selection' && selectedElement && canvasRect && (
          <ElementRect element={selectedElement} canvasOffset={{ x: canvasRect.left, y: canvasRect.top }} />
        )} */}
      </div>
    </div>
  );
}

export default CanvasBase;

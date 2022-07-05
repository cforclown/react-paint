import React, {
  useEffect, useLayoutEffect, useMemo, useRef, useState,
} from 'react';
import { useSelector } from 'react-redux';
import rough from 'roughjs/bin/rough';
import { RoughGenerator } from 'roughjs/bin/generator';
import {
  drawElement,
  getElementAtPosition,
  resizedCoordinates,
  adjustmentRequired,
  adjustElementCoordinates,
  CanvasAction,
} from './Canvas.service';
import {
  isElementType,
  createElement,
  ElementType,
  TypeElement,
  ILineElement,
  IRectangleElement,
  ITextElement,
  isShapeElementType,
  IPoint,
  getElementRectWithStrokeWidthOffset,
} from '../../Utils/Element/Element.service';
import { IState } from '../../Reducer/Reducer';
import ElementRect from '../ElementRect/ElementRect.style';

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
  currentElement?: TypeElement;
  setCurrentElement: (element?: TypeElement) => void;
  className?: string;
}

function CanvasBase({
  roughGeneratopr: generator,
  elements,
  setElements,
  undo, redo,
  currentElement,
  setCurrentElement,
  className,
}: ICanvas): JSX.Element {
  const {
    tool, toolOptions, canvasSize, color,
  } = useSelector<IState>((state) => state) as IState;
  const [action, setAction] = useState<CanvasAction>('none');
  const [tempElement, setTempElement] = useState<TypeElement | undefined>(undefined);
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
        if (action === 'writing' && tempElement && tempElement.id === element.id) {
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
  }, [elements, action, tempElement, currentElement, canvasSize]);

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
    if (action === 'writing' && textArea && tempElement && tempElement.type === 'text') {
      textArea.focus();
      textArea.value = tempElement.text;
    }
  }, [action, tempElement]);

  const [textareaBlurTimeout, setTextareBlurTimeout] = useState<boolean>(false);
  useEffect(() => {
    if (textareaBlurTimeout) {
      setTimeout(() => {
        setTextareBlurTimeout(false);
      }, 500);
    }
  }, [textareaBlurTimeout]);

  const updateElement = (id: number, type: ElementType, x1: number, y1: number, x2: number, y2: number, options?: { text?: string }): void => {
    const elementsCopy = [...elements];

    try {
      if (isShapeElementType(type)) {
        if (!x2 || !y2) {
          throw new Error('updateElement: x2 and y2 is undefined');
        }
        elementsCopy[id] = createElement(generator, id, type, x1, y1, x2, y2, elementsCopy[id].color, elementsCopy[id].options ?? {});
      } else if (type === 'pencil') {
        elementsCopy[id].color = color;
        elementsCopy[id].points = [...elementsCopy[id].points, { x: x2, y: y2 }];
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
    if (tempElement && tempElement.id === id) {
      setTempElement({ ...elementsCopy[id] });
    }
  };

  const handleLeftClick = (event: React.MouseEvent<HTMLCanvasElement>): void => {
    if (!canvasRect || tool !== 'selection') {
      return;
    }

    const mousePos = getMousePoint(event, canvasRect);
    const element = getElementAtPosition(mousePos, elements);
    if (!element) {
      setCurrentElement(undefined);
      return;
    }

    if (element.type === 'pencil') {
      const xOffsets = element.points.map((point) => mousePos.x - point.x);
      const yOffsets = element.points.map((point) => mousePos.y - point.y);
      setCurrentElement({ ...element, xOffsets, yOffsets });
    } else {
      const offsetX = mousePos.x - element.x1;
      const offsetY = mousePos.y - element.y1;
      setCurrentElement({ ...element, offsetX, offsetY });
    }
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>): void => {
    if (!canvasRect || action === 'writing') {
      return;
    }

    const mousePos = getMousePoint(event, canvasRect);
    if (isElementType(tool)) {
      const id = elements.length;
      const element = createElement(generator, id, tool as ElementType, mousePos.x, mousePos.y, mousePos.x, mousePos.y, color, toolOptions[tool]);
      if (!element) {
        return;
      }
      setElements((prevState: any) => [...prevState, element]);
      setAction(tool === 'text' ? 'writing' : 'drawing');
      if (tool === 'text' && !textareaBlurTimeout) {
        event.preventDefault();
        setTextareBlurTimeout(true);
      }
      setTempElement(element);
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
      event.currentTarget.style.cursor = element ? 'pointer' : 'default';
      return;
    }

    if (action === 'drawing') {
      const index = elements.length - 1;
      const { x1, y1 } = elements[index];
      updateElement(index, tool as ElementType, x1, y1, mousePos.x, mousePos.y);
    } else if (action === 'moving') {
      if (!tempElement) {
        return;
      }

      if (tempElement.type === 'pencil') {
        const newPoints = tempElement.points.map((_, index) => ({
          x: mousePos.x - tempElement.xOffsets[index],
          y: mousePos.y - tempElement.yOffsets[index],
        }));
        const elementsCopy = [...elements];
        elementsCopy[tempElement.id] = {
          ...elementsCopy[tempElement.id],
          points: newPoints,
        };
        setElements(elementsCopy, true);
      } else {
        const {
          id, x1, x2, y1, y2, type, offsetX, offsetY,
        } = tempElement;
        const width = x2 - x1;
        const height = y2 - y1;
        const newX1 = mousePos.x - offsetX;
        const newY1 = mousePos.y - offsetY;
        const options = type === 'text' ? { text: tempElement.text } : {};
        updateElement(id, type, newX1, newY1, newX1 + width, newY1 + height, options);
      }
    } else if (action === 'resizing') {
      if (!tempElement) {
        return;
      }
      if (tempElement.type === 'pencil') {
        return;
      }
      const {
        id, type, position, ...coordinates
      } = tempElement;
      const newCoordinates = resizedCoordinates(mousePos.x, mousePos.y, coordinates, position);
      if (newCoordinates) {
        updateElement(id, type, newCoordinates.x1, newCoordinates.y1, newCoordinates.x2, newCoordinates.y2);
      }
    }
  };

  const handleMouseUp = (event: React.MouseEvent<HTMLCanvasElement>): void => {
    if (!canvasRect || tool === 'selection') {
      return;
    }
    const mousePos = getMousePoint(event, canvasRect);
    if (tempElement) {
      if (
        tempElement.type === 'text'
        && mousePos.x - tempElement.offsetX === tempElement.x1
        && mousePos.y - tempElement.offsetY === tempElement.y1
      ) {
        setAction('writing');
        return;
      }

      const index = tempElement.id;
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
    if (
      tempElement
      && isShapeElementType(tempElement.type)
      && (tempElement.x1 === tempElement.x2 && tempElement.y1 === tempElement.y2)
    ) {
      setElements([...elements].filter((e) => e.id !== tempElement.id));
    }
    setTempElement(undefined);
  };

  const handleBlur = (event: React.FocusEvent<HTMLTextAreaElement>): void => {
    if (!tempElement) {
      return;
    }

    const {
      id, type, x1, y1, x2, y2,
    } = tempElement as ILineElement | IRectangleElement | ITextElement;
    setAction('none');
    if (event.target.value !== '') {
      updateElement(id, type, x1, y1, x2, y2, { text: event.target.value });
    } else {
      setElements([...elements].filter((e) => e.id !== tempElement.id));
    }
    setTempElement(undefined);
  };

  const handleEditElement = (element: TypeElement, params?: Record<string, any>): void => {
    updateElement(element.id, element.type, element.x1, element.y1, element.x2, element.y2, params);
    setCurrentElement(element);
  };

  const textArea = (action === 'writing' && tempElement && tempElement.type !== 'pencil') && (
    <textarea
      className="text-area"
      ref={textAreaRef}
      onBlur={handleBlur}
      style={{
        position: 'fixed',
        left: tempElement.x1 + (canvasRect ? canvasRect.left : 0) - 4,
        top: tempElement.y1 + (canvasRect ? canvasRect.top : 0) - 4,
        font: '24px sans-serif',
      }}
    />
  );

  const currentElementRect = useMemo(() => currentElement && canvasRect && (
    <ElementRect
      element={currentElement}
      elementRect={getElementRectWithStrokeWidthOffset(currentElement)}
      setElement={setCurrentElement}
      onEdit={handleEditElement}
      canvasOffset={{ x: canvasRect.left, y: canvasRect.top }}
    />
  ), [currentElement]);

  return (
    <div className={className}>
      <div className="canvas-container" id="canvas-container">
        {textArea}
        <canvas
          id="canvas"
          width={canvasSize.width}
          height={canvasSize.height}
          onClick={handleLeftClick}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          Canvas
        </canvas>
        {currentElementRect}
      </div>
    </div>
  );
}

export default CanvasBase;

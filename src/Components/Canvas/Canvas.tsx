import React, {
  useEffect, useLayoutEffect, useRef, useState,
} from 'react';
import styled from 'styled-components';
import rough from 'roughjs/bin/rough';
import { useSelector } from 'react-redux';
import {
  isElementType,
  createElement,
  drawElement,
  ElementType,
  getElementAtPosition,
  TypeElement,
  resizedCoordinates,
  cursorForPosition,
  PositionType,
  adjustmentRequired,
  adjustElementCoordinates,
  ILineElement,
  IRectangleElement,
  ITextElement,
} from './Canvas.service';
import { IState } from '../../Reducer/Reducer';

const Container = styled.div`
  width: 100%;
  height: 100%;
  padding: 1rem 0 0 1rem;
  overflow: auto;
`;

const CanvasContainer = styled.div`
  width: 100%;
  height: 100%;
  > canvas {
    background-color: white;
    box-shadow: 0px 0px 6px #00000080;
  }
`;

const TextAreaContainer = styled.textarea`
  border: 1px solid #b2bec3;
`;

const generator = rough.generator();

function getMousePosition(mouseEvent: React.MouseEvent<HTMLCanvasElement>, canvasRect: DOMRect): { mouseX: number; mouseY: number; } {
  const { clientX, clientY } = mouseEvent;
  return {
    mouseX: clientX - canvasRect.left,
    mouseY: clientY - canvasRect.top,
  };
}

interface ICanvas {
  elements: any[],
  setElements: (state: any, overwrite?: boolean | undefined) => void,
  undo: () => void,
  redo: () => void
}

function Canvas({
  elements, setElements, undo, redo,
}: ICanvas): JSX.Element {
  const {
    tool, toolOptions, canvasSize, color,
  } = useSelector<IState>((state) => state) as IState;
  const [action, setAction] = useState('none');
  const [selectedElement, setSelectedElement] = useState<TypeElement | null>(null);
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
      if (action === 'writing' && selectedElement && selectedElement.id === element.id) {
        return;
      }
      drawElement(roughCanvas, context, element);
    });
  }, [elements, action, selectedElement]);

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
      // if (type === 'line' || type === 'rectangle' || type === 'triangle') {
      if (type === 'line' || type === 'rectangle') {
        if (!x2 || !y2) {
          throw new Error('updateElement: x2 and y2 is undefined');
        }
        elementsCopy[id] = createElement(generator, id, type, x1, y1, x2, y2, color, toolOptions[type]);
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
          ...createElement(generator, id, type, x1, y1, x1 + textWidth, y1 + textHeight, color, toolOptions[type]),
          text,
        };
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

    const { mouseX, mouseY } = getMousePosition(event, canvasRect);
    if (tool === 'selection') {
      const element = getElementAtPosition(mouseX, mouseY, elements);
      if (element) {
        if (element.type === 'pencil') {
          const xOffsets = element.points.map((point) => mouseX - point.x);
          const yOffsets = element.points.map((point) => mouseY - point.y);
          setSelectedElement({ ...element, xOffsets, yOffsets });
        } else {
          const offsetX = mouseX - element.x1;
          const offsetY = mouseY - element.y1;
          setSelectedElement({ ...element, offsetX, offsetY });
        }
        setElements((prevState: any) => prevState);

        if (element.position === 'inside') {
          setAction('moving');
        } else {
          setAction('resizing');
        }
      }
    } else if (isElementType(tool)) {
      const id = elements.length;
      const element = createElement(generator, id, tool as ElementType, mouseX, mouseY, mouseX, mouseY, color, toolOptions[tool]);
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

    const { mouseX, mouseY } = getMousePosition(event, canvasRect);
    if (tool === 'selection') {
      const element = getElementAtPosition(mouseX, mouseY, elements);
      // eslint-disable-next-line no-param-reassign
      event.currentTarget.style.cursor = element ? cursorForPosition(element.position as PositionType) : 'default';
    }

    if (action === 'drawing') {
      const index = elements.length - 1;
      const { x1, y1 } = elements[index];
      updateElement(index, tool as ElementType, x1, y1, mouseX, mouseY);
    } else if (action === 'moving') {
      if (!selectedElement) {
        return;
      }

      if (selectedElement.type === 'pencil') {
        const newPoints = selectedElement.points.map((_, index) => ({
          x: mouseX - selectedElement.xOffsets[index],
          y: mouseY - selectedElement.yOffsets[index],
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
        const newX1 = mouseX - offsetX;
        const newY1 = mouseY - offsetY;
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
      const newCoordinates = resizedCoordinates(mouseX, mouseY, coordinates, position);
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
    <Container>
      <CanvasContainer id="canvas-container">
        {(action === 'writing' && selectedElement && selectedElement.type !== 'pencil') ? (
          <TextAreaContainer
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
      </CanvasContainer>
    </Container>
  );
}

export default Canvas;

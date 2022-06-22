import React, {
  MouseEventHandler,
  useEffect, useLayoutEffect, useRef, useState,
} from 'react';
import styled from 'styled-components';
import rough from 'roughjs';
import getStroke from 'perfect-freehand';
import { RoughGenerator } from 'roughjs/bin/generator';
import { Drawable } from 'roughjs/bin/core';
import { Point } from 'roughjs/bin/geometry';
import { useHistory } from '../../Hooks/UseHistory';
import {
  isElementType, createElement, drawElement, ElementType, getElementAtPosition, TypeElement, resizedCoordinates, cursorForPosition, PositionType,
} from './Canvas.service';

const Container = styled.div`
  width: 100%;
  padding: 1rem;
`;

const CanvasContainer = styled.div`
  background-color: white;
  height: 100%;
  box-shadow: 1px 4px 6px #00000040;
`;

const generator = rough.generator();

function Canvas(): JSX.Element {
  const [
    elements,
    setElements,
    undo,
    redo,
  ] = useHistory([]);
  const [action, setAction] = useState('none');
  const [tool, setTool] = useState<ElementType | 'selection'>('text');
  const [selectedElement, setSelectedElement] = useState<TypeElement>();
  const textAreaRef = useRef<HTMLTextAreaElement>();

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
      if (action === 'writing' && selectedElement && selectedElement.id === element.id) return;
      drawElement(roughCanvas, context, element);
    });
  }, [elements, action, selectedElement]);

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

  const updateElement = (id: number, type: ElementType, x1: number, y1: number, x2: number, y2: number, options?: { text: string }): void => {
    const elementsCopy = [...elements];

    try {
      if (type === 'line' || type === 'rectangle') {
        elementsCopy[id] = createElement(generator, id, type, x1, y1, x2, y2);
      } else if (type === 'pencil') {
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
        const text = options ? options.text : ''
        const textWidth = canvasContext.measureText(text).width;
        const textHeight = 24;
        elementsCopy[id] = {
          ...createElement(generator, id, type, x1, y1, x1 + textWidth, y1 + textHeight),
          text
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
    if (action === 'writing') return;

    const { clientX, clientY } = event;
    if (tool === 'selection') {
      const element = getElementAtPosition(clientX, clientY, elements);
      if (element) {
        if (element.type === 'pencil') {
          const xOffsets = element.points.map((point) => clientX - point.x);
          const yOffsets = element.points.map((point) => clientY - point.y);
          setSelectedElement({ ...element, xOffsets, yOffsets });
        } else {
          const offsetX = clientX - element.x1;
          const offsetY = clientY - element.y1;
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
      const element = createElement(generator, id, tool as ElementType, clientX, clientY, clientX, clientY);
      if (!element) {
        return;
      }
      setElements((prevState: any) => [...prevState, element]);
      setSelectedElement(element);

      setAction(tool === 'text' ? 'writing' : 'drawing');
    }
  };

  const handleMouseMove = ((event: React.MouseEvent<HTMLCanvasElement>): void => {
    const { clientX, clientY } = event;

    if (tool === 'selection') {
      const element = getElementAtPosition(clientX, clientY, elements);
      event.currentTarget.style.cursor = element ? cursorForPosition(element.position as PositionType) : 'default';
    }

    if (action === 'drawing') {
      const index = elements.length - 1;
      const { x1, y1 } = elements[index];
      updateElement(index, tool as ElementType, x1, y1, clientX, clientY);
    } else if (action === 'moving') {
      if (selectedElement.type === 'pencil') {
        const newPoints = selectedElement.points.map((_, index) => ({
          x: clientX - selectedElement.xOffsets[index],
          y: clientY - selectedElement.yOffsets[index],
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
        const newX1 = clientX - offsetX;
        const newY1 = clientY - offsetY;
        const options = type === 'text' ? { text: selectedElement.text } : {};
        updateElement(id, type, newX1, newY1, newX1 + width, newY1 + height, options);
      }
    } else if (action === 'resizing') {
      const {
        id, type, position, ...coordinates
      } = selectedElement;
      const {
        x1, y1, x2, y2,
      } = resizedCoordinates(clientX, clientY, position, coordinates);
      updateElement(id, type, x1, y1, x2, y2);
    }
  };

  const handleMouseUp = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const { clientX, clientY } = event;
    if (selectedElement) {
      if (
        selectedElement.type === 'text'
        && clientX - selectedElement.offsetX === selectedElement.x1
        && clientY - selectedElement.offsetY === selectedElement.y1
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

    if (action === 'writing') return;

    setAction('none');
    setSelectedElement(null);
  };

  const handleBlur = (event) => {
    const {
      id, x1, y1, type,
    } = selectedElement;
    setAction('none');
    setSelectedElement(null);
    updateElement(id, type, x1, y1, null, null, { text: event.target.value });
  };

  return (
    <Container>
      <CanvasContainer>
        <div style={{ position: 'fixed' }}>
          <input
            type="radio"
            id="selection"
            checked={tool === 'selection'}
            onChange={() => setTool('selection')}
          />
          <label htmlFor="selection">Selection</label>
          <input type="radio" id="line" checked={tool === 'line'} onChange={() => setTool('line')} />
          <label htmlFor="line">Line</label>
          <input
            type="radio"
            id="rectangle"
            checked={tool === 'rectangle'}
            onChange={() => setTool('rectangle')}
          />
          <label htmlFor="rectangle">Rectangle</label>
          <input
            type="radio"
            id="pencil"
            checked={tool === 'pencil'}
            onChange={() => setTool('pencil')}
          />
          <label htmlFor="pencil">Pencil</label>
          <input type="radio" id="text" checked={tool === 'text'} onChange={() => setTool('text')} />
          <label htmlFor="text">Text</label>
        </div>
        <div style={{ position: 'fixed', bottom: 0, padding: 10 }}>
          <button onClick={undo}>Undo</button>
          <button onClick={redo}>Redo</button>
        </div>
        {action === 'writing' ? (
          <textarea
            ref={textAreaRef}
            onBlur={handleBlur}
            style={{
              position: 'fixed',
              top: selectedElement.y1 - 2,
              left: selectedElement.x1,
              font: '24px sans-serif',
              margin: 0,
              padding: 0,
              border: 0,
              outline: 0,
              resize: 'auto',
              overflow: 'hidden',
              whiteSpace: 'pre',
              background: 'transparent',
            }}
          />
        ) : null}
        <canvas
          id="canvas"
          width={window.innerWidth}
          height={window.innerHeight}
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

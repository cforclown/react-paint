import React, {
  useEffect, useLayoutEffect, useMemo, useRef, useState,
} from 'react';
import { useSelector } from 'react-redux';
import { RoughGenerator } from 'roughjs/bin/generator';
import rough from 'roughjs/bin/rough';
import styled from 'styled-components';
import {
  CanvasAction,
} from './Canvas.service';
import {
  isElementType,
  isShapeElementType,
  generateElement,
  generateElementId,
  generateElementName,
} from '../../Utils/Element/Element.service';
import { IState } from '../../Reducer/Reducer';
import ElementRect from '../ElementRect/ElementRect.style';
import Element, { IUpdateElementParams } from '../../Utils/Element/Element';
import TextElement from '../../Utils/Element/Text/Text';
import { IPoint, TraceError } from '../../Utils/Common';

import Pencil from '../../Utils/Element/Pencil/Pencil';

function getMousePoint(mouseEvent: React.MouseEvent<HTMLCanvasElement>, canvasRect: DOMRect): IPoint {
  const { clientX, clientY } = mouseEvent;
  return {
    x: clientX - canvasRect.left,
    y: clientY - canvasRect.top,
  };
}

const TextArea = styled.textarea<{fontSize: number; fontFamily: string;}>`
  font: ${(props) => props.fontSize}px ${(props) => props.fontFamily};
`;

interface ICanvas {
  roughGenerator: RoughGenerator,
  elements: Element[];
  setElements: (state: any, overwrite?: boolean | undefined) => void;
  undo: () => void;
  redo: () => void;
  selectedElement?: Element;
  setSelectedElement: (element?: Element) => void;
  className?: string;
}

function CanvasBase({
  roughGenerator,
  elements,
  setElements,
  undo, redo,
  selectedElement,
  setSelectedElement,
  className,
}: ICanvas): JSX.Element {
  const {
    tool, toolOptions, canvasSize, color,
  } = useSelector<IState>((state) => state) as IState;
  const [action, setAction] = useState<CanvasAction>('none');
  const [tempElement, setTempElement] = useState<Element | undefined>(undefined);
  const [canvasRect, setCanvasRect] = useState<DOMRect>();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    const context = canvasRef.current?.getContext('2d');
    if (!context) {
      return;
    }
    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    const roughCanvas = rough.canvas(canvasRef.current);

    elements.forEach((element) => {
      try {
        if (action === 'writing' && tempElement && tempElement.id === element.id) {
          return;
        }
        element.draw(roughCanvas, context);
      } catch (err) {
        if (err instanceof Error) {
          console.error(err.message);
        }
      }
    });
  }, [elements, action, tempElement, selectedElement, canvasSize]);

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
      textArea.value = (tempElement as TextElement).text;
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

  const updateElement = (params: IUpdateElementParams): void => {
    const elementsCopy = [...elements];
    const currentElement = elementsCopy.find((e) => e.id === params.id);
    if (!currentElement) {
      return;
    }
    currentElement.update(params);
    setElements(elementsCopy, true);
    if (tempElement && tempElement.id === params.id) {
      setTempElement(currentElement);
    }
  };

  const handleLeftClick = (event: React.MouseEvent<HTMLCanvasElement>): void => {
    if (!canvasRect || tool !== 'selection') {
      return;
    }

    const mousePos = getMousePoint(event, canvasRect);
    const element = elements.reverse().find((e) => e.isHover(mousePos));
    if (!element) {
      setSelectedElement(undefined);
      return;
    }
    setSelectedElement(element);
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>): void => {
    if (!canvasRef.current || !canvasRect || action === 'writing') {
      return;
    }

    try {
      const mousePos = getMousePoint(event, canvasRect);
      if (isElementType(tool)) {
        const element = generateElement({
          id: generateElementId(),
          name: generateElementName(elements, tool),
          type: tool,
          roughGenerator,
          rect: {
            x: mousePos.x,
            y: mousePos.y,
            width: 0,
            height: 0,
          },
          color,
          options: toolOptions[tool],
        });
        setElements((prevState: any) => [...prevState, element]);
        setAction(tool === 'text' ? 'writing' : 'drawing');
        if (tool === 'text' && !textareaBlurTimeout) {
          event.preventDefault();
          setTextareBlurTimeout(true);
        }
        setTempElement(element);
      }
    } catch (err) {
      if (err instanceof Error) {
        TraceError(err);
      }
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>): void => {
    if (!canvasRect) {
      return;
    }

    const mousePos = getMousePoint(event, canvasRect);
    if (tool === 'selection') {
      const element = elements.find((e) => e.isHover(mousePos));
      // eslint-disable-next-line no-param-reassign
      event.currentTarget.style.cursor = element ? 'pointer' : 'default';
      return;
    }

    if (!tempElement) {
      return;
    }

    if (action !== 'drawing') {
      return;
    }

    try {
      if (tempElement.type === 'pencil') {
        (tempElement as Pencil).points.push({
          x: mousePos.x,
          y: mousePos.y,
        });
      }
      updateElement({
        ...tempElement,
        rect: {
          ...tempElement.rect,
          width: mousePos.x - tempElement.rect.x,
          height: mousePos.y - tempElement.rect.y,
        },
      });
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
      }
    }
  };

  const handleMouseUp = (event: React.MouseEvent<HTMLCanvasElement>): void => {
    if (!canvasRect || tool === 'selection') {
      return;
    }
    // const mousePos = getMousePoint(event, canvasRect);
    if (tempElement) {
      if (
        tempElement.type === 'text'
        // && mousePos.x - tempElement.offset.x === tempElement.rect.x
        // && mousePos.y - tempElement.offset.y === tempElement.rect.y
      ) {
        setAction('writing');
        return;
      }

      tempElement.adjustRect();
      updateElement(tempElement);
    }

    if (action === 'writing') {
      return;
    }

    setAction('none');
    if (
      tempElement
      && isShapeElementType(tempElement.type)
      && (tempElement.rect.width === 0 && tempElement.rect.height === 0)
    ) {
      setElements([...elements].filter((e) => e.id !== tempElement.id));
    }
    setTempElement(undefined);
  };

  const handleBlur = (event: React.FocusEvent<HTMLTextAreaElement>): void => {
    if (!tempElement) {
      return;
    }

    setAction('none');
    if (event.target.value !== '') {
      updateElement({
        ...tempElement,
        text: event.target.value,
      });
    } else {
      setElements([...elements].filter((e) => e.id !== tempElement.id));
    }
    setTempElement(undefined);
  };

  const handleEditElement = (params: Element): void => {
    updateElement(params);
    setSelectedElement(params);
  };

  const textArea = (tool === 'text' && action === 'writing' && tempElement && tempElement.type !== 'pencil') && (
    <TextArea
      className="text-area"
      ref={textAreaRef}
      onBlur={handleBlur}
      style={{
        position: 'fixed',
        left: tempElement.rect.x + (canvasRect ? canvasRect.left : 0) - 4,
        top: tempElement.rect.y + (canvasRect ? canvasRect.top : 0) - 4,
      }}
      fontSize={toolOptions[tool].fontSize}
      fontFamily={toolOptions[tool].fontFamily}
    />
  );

  const currentElementRect = useMemo(() => selectedElement && canvasRect && (
    <ElementRect
      element={selectedElement}
      elementRect={selectedElement.rect}
      setElement={setSelectedElement}
      onEdit={handleEditElement}
      canvasOffset={{ x: canvasRect.left, y: canvasRect.top }}
    />
  ), [selectedElement]);

  return (
    <div className={className}>
      <div className="canvas-container" id="canvas-container">
        {textArea}
        <canvas
          ref={canvasRef}
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

import getStroke from 'perfect-freehand';
import { RoughCanvas } from 'roughjs/bin/canvas';
import { Drawable } from 'roughjs/bin/core';
import { RoughGenerator } from 'roughjs/bin/generator';
import { Point } from 'roughjs/bin/geometry';
import { ToolOptions } from '../../Types/Common';

const ElementTypes = ['line', 'rectangle', 'triangle', 'pencil', 'text'] as const;
export type ElementType = (typeof ElementTypes)[number];
export const isElementType = (type: any): type is ElementType => ElementTypes.includes(type);

const ToolTypes = ['selection', 'line', 'rectangle', 'triangle', 'pencil', 'text'] as const;
export type ToolType = (typeof ToolTypes)[number];
export const isToolType = (tool: any): tool is ToolType => ToolTypes.includes(tool);

export type TypeElement = ILineElement | IRectangleElement | ITriangleElement | IPencilElement | ITextElement
export interface IElement {
  id: number;
  type: ElementType;
  color: string;
  options?: ToolOptions
  position?: string | null;
}

export interface IPoint {
  x: number;
  y: number;
}

export type PositionType = 'tl' | 'br' | 'start' | 'end' | 'tr' | 'bl' | 'inside'

export interface ILineElement extends IElement {
  type: 'line';
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  offsetX: number;
  offsetY: number;
  roughElement: Drawable;
}

export interface IRectangleElement extends Omit<ILineElement, 'type'> {
  type: 'rectangle'
}

export interface ITriangleElement extends IElement {
  type: 'triangle',
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  offsetX: number;
  offsetY: number;

  points: [IPoint, IPoint, IPoint]
  roughElement: Drawable;
}

export interface IPencilElement extends IElement {
  type: 'pencil';
  points: IPoint[];
  xOffsets: number[];
  yOffsets: number[];
}

export interface ITextElement extends IElement {
  type: 'text';
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  offsetX: number;
  offsetY: number;
  text: string;
  color: string;
}

export interface IElementCoordinate {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export function createLine(
  id: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  roughGeneratopr: RoughGenerator,
  color: string,
  options: Record<string, any>,
): ILineElement {
  return {
    id,
    type: 'line',
    x1,
    y1,
    x2,
    y2,
    offsetX: 0,
    offsetY: 0,
    roughElement: roughGeneratopr.line(x1, y1, x2, y2, {
      stroke: color,
      fill: color,
      ...options,
    }),
    color,
  };
}

export function createRectangle(
  id: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  roughGeneratopr: RoughGenerator,
  color: string,
  options: Record<string, any>,
): IRectangleElement {
  return {
    id,
    type: 'rectangle',
    x1,
    y1,
    x2,
    y2,
    offsetX: 0,
    offsetY: 0,
    roughElement: roughGeneratopr.rectangle(x1, y1, x2 - x1, y2 - y1, {
      stroke: color,
      fill: color,
      ...options,
    }),
    color,
  };
}

export function createTriangle(
  id: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  roughGeneratopr: RoughGenerator,
  color: string,
  options: Record<string, any>,
): ITriangleElement {
  const points: [IPoint, IPoint, IPoint] = [
    { x: x1 + (x2 - x1) / 2, y: y1 },
    { x: x2, y: y2 },
    { x: x1, y: y2 },
  ];
  const polygonPoints: Point[] = points.map((p) => [p.x, p.y]);
  return {
    id,
    type: 'triangle',
    x1,
    y1,
    x2,
    y2,
    offsetX: 0,
    offsetY: 0,
    roughElement: roughGeneratopr.polygon(polygonPoints, {
      stroke: color,
      fill: color,
      ...options,
    }),
    points,
    color,
  };
}

export const createElement = (
  roughGeneratopr: RoughGenerator,
  id: number,
  type: ElementType,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: string,
  options: Record<string, any>,
): TypeElement | null => {
  if (type === 'line') {
    return createLine(id, x1, y1, x2, y2, roughGeneratopr, color, options);
  }
  if (type === 'rectangle') {
    return createRectangle(id, x1, y1, x2, y2, roughGeneratopr, color, options);
  }
  if (type === 'triangle') {
    return createTriangle(id, x1, y1, x2, y2, roughGeneratopr, color, options);
  }
  if (type === 'pencil') {
    return {
      id,
      type,
      points: [{ x: x1, y: y1 }],
      xOffsets: [],
      yOffsets: [],
      color,
    };
  }
  if (type === 'text') {
    return {
      id,
      type,
      x1,
      y1,
      x2,
      y2,
      offsetX: 0,
      offsetY: 0,
      text: '',
      color,
    };
  }

  return null;
};

export const onLine = (x1: any, y1: any, x2: any, y2: any, x: any, y: any, maxDistance = 1): 'inside' | null => {
  const a = { x: x1, y: y1 };
  const b = { x: x2, y: y2 };
  const c = { x, y };
  const offset = distance(a, b) - (distance(a, c) + distance(b, c));
  return Math.abs(offset) < maxDistance ? 'inside' : null;
};

export const nearPoint = (x: any, y: any, x1: any, y1: any, name: string): string | null => (Math.abs(x - x1) < 5 && Math.abs(y - y1) < 5 ? name : null);

const positionWithinElement = (x: any, y: any, element: TypeElement): string | null => {
  const { type } = element;
  if (type === 'line') {
    const {
      x1, y1, x2, y2,
    } = element;
    const on = onLine(x1, y1, x2, y2, x, y);
    const start = nearPoint(x, y, x1, y1, 'start');
    const end = nearPoint(x, y, x2, y2, 'end');
    return start || end || on;
  }
  if (type === 'rectangle') {
    const {
      x1, y1, x2, y2,
    } = element;
    const topLeft = nearPoint(x, y, x1, y1, 'tl');
    const topRight = nearPoint(x, y, x2, y1, 'tr');
    const bottomLeft = nearPoint(x, y, x1, y2, 'bl');
    const bottomRight = nearPoint(x, y, x2, y2, 'br');
    const inside = x >= x1 && x <= x2 && y >= y1 && y <= y2 ? 'inside' : null;
    return topLeft || topRight || bottomLeft || bottomRight || inside;
  }
  if (type === 'pencil') {
    const betweenAnyPoint = element.points.some((point, index) => {
      const nextPoint = element.points[index + 1];
      if (!nextPoint) return false;
      return onLine(point.x, point.y, nextPoint.x, nextPoint.y, x, y, 5) != null;
    });
    return betweenAnyPoint ? 'inside' : null;
  }
  if (type === 'text') {
    const {
      x1, y1, x2, y2,
    } = element;
    return x >= x1 && x <= x2 && y >= y1 && y <= y2 ? 'inside' : null;
  }

  // eslint-disable-next-line no-console
  console.error('positionWithinElement:', 'params: (', x, y, JSON.stringify(element), ') error: type is not recognized');
  return null;
};

export const distance = (a: IPoint, b: IPoint): number => Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);

export const getElementAtPosition = (
  x: number,
  y: number,
  elements: TypeElement[],
): TypeElement | undefined => elements.map((element) => ({ ...element, position: positionWithinElement(x, y, element) })).find((element) => !!element.position);

export const adjustElementCoordinates = (element: ILineElement | IRectangleElement | ITextElement): IElementCoordinate => {
  const {
    type, x1, y1, x2, y2,
  } = element;
  if (type === 'rectangle') {
    const minX = Math.min(x1, x2);
    const maxX = Math.max(x1, x2);
    const minY = Math.min(y1, y2);
    const maxY = Math.max(y1, y2);
    return {
      x1: minX, y1: minY, x2: maxX, y2: maxY,
    };
  }

  if (x1 < x2 || (x1 === x2 && y1 < y2)) {
    return {
      x1, y1, x2, y2,
    };
  }
  return {
    x1: x2,
    y1: y2,
    x2: x1,
    y2: y1,
  };
};

export const cursorForPosition = (position?: PositionType): string => {
  switch (position) {
    case 'tl':
    case 'br':
    case 'start':
    case 'end':
      return 'nwse-resize';
    case 'tr':
    case 'bl':
      return 'nesw-resize';
    default:
      return 'move';
  }
};

export const resizedCoordinates = (clientX: number, clientY: number, coordinates: IElementCoordinate, position?: string | null): IElementCoordinate | null => {
  const {
    x1, y1, x2, y2,
  } = coordinates;
  switch (position) {
    case 'tl':
    case 'start':
      return {
        x1: clientX, y1: clientY, x2, y2,
      };
    case 'tr':
      return {
        x1, y1: clientY, x2: clientX, y2,
      };
    case 'bl':
      return {
        x1: clientX, y1, x2, y2: clientY,
      };
    case 'br':
    case 'end':
      return {
        x1, y1, x2: clientX, y2: clientY,
      };
    default:
      return null; // should not really get here...
  }
};

const getSvgPathFromStroke = (stroke: number[][], color?: string): string => {
  if (!stroke.length) {
    return '';
  }

  const d = stroke.reduce(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length];
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
      return acc;
    },
    ['M', ...stroke[0], 'Q'],
  );

  d.push('Z');
  return d.join(' ');
};

export const drawElement = (roughCanvas: RoughCanvas, context: CanvasRenderingContext2D, element: TypeElement): void => {
  switch (element.type) {
    case 'line':
    case 'rectangle':
    case 'triangle':
      roughCanvas.draw(element.roughElement);
      break;
    case 'pencil':
      context.fillStyle = element.color;
      context.fill(new Path2D(getSvgPathFromStroke(getStroke(element.points))));
      break;
    case 'text':
      context.textBaseline = 'top';
      context.font = '24px sans-serif';
      context.fillText(element.text, element.x1, element.y1);
      break;
    default:
      throw new Error(`Type not recognised: ${JSON.stringify(element)}`);
  }
};

export const adjustmentRequired = (type: string): boolean => ['line', 'rectangle'].includes(type);

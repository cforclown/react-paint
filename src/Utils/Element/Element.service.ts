import { Drawable } from 'roughjs/bin/core';
import { RoughGenerator } from 'roughjs/bin/generator';
import { Point } from 'roughjs/bin/geometry';
import { ToolOptions } from './ElementOption/ElementOption.service';

const ShapeElementTypes = ['line', 'rectangle', 'triangle', 'circle', 'ellipse'] as const;
export type ShapeElementType = (typeof ShapeElementTypes)[number];
export const isShapeElementType = (type: any): type is ShapeElementType => ShapeElementTypes.includes(type);
export type TypeShape = ILineElement | IRectangleElement | ITriangleElement | ICircleElement | IEllipseElement

const ElementTypes = [...ShapeElementTypes, 'pencil', 'text', 'image'] as const;
export type ElementType = (typeof ElementTypes)[number];
export const isElementType = (type: any): type is ElementType => ElementTypes.includes(type);

const ToolTypes = ['selection', ...ShapeElementTypes, 'pencil', 'text'] as const;
export type ToolType = (typeof ToolTypes)[number];
export const isToolType = (tool: any): tool is ToolType => ToolTypes.includes(tool);

export type TypeElement = ILineElement | IRectangleElement | ITriangleElement | ICircleElement | IEllipseElement | IPencilElement | ITextElement | IImageElement
export interface IElement {
  id: number;
  type: ElementType;
  color: string;
  options?: Record<string, any>;
  position?: string | null;
}

export interface IPoint {
  x: number;
  y: number;
}

export interface ISize {
  width: number;
  height: number;
}

export interface IRect extends IPoint, ISize {}

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

export interface ITriangleElement extends Omit<ILineElement, 'type'> {
  type: 'triangle'
}

export interface ICircleElement extends Omit<ILineElement, 'type'> {
  type: 'circle'
}

export interface IEllipseElement extends Omit<ILineElement, 'type'> {
  type: 'ellipse'
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
export interface IImageElement extends IElement {
  type: 'image';
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  image: string | ArrayBuffer;
  offsetX: number;
  offsetY: number;
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
    options,
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
    options,
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
    color,
    options,
  };
}

export function createCircle(
  id: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  roughGeneratopr: RoughGenerator,
  color: string,
  options: Record<string, any>,
): ICircleElement {
  const diameter = Math.min(x2 - x1, y2 - y1);
  const centerx = x1 + diameter / 2;
  const centery = y1 + diameter / 2;
  return {
    id,
    type: 'circle',
    x1,
    y1,
    x2: x1 + diameter,
    y2: y1 + diameter,
    offsetX: 0,
    offsetY: 0,
    roughElement: roughGeneratopr.circle(centerx, centery, diameter, {
      stroke: color,
      fill: color,
      ...options,
    }),
    color,
    options,
  };
}

export function createEllipse(
  id: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  roughGeneratopr: RoughGenerator,
  color: string,
  options: Record<string, any>,
): IEllipseElement {
  const width = x2 - x1;
  const height = y2 - y1;
  const centerx = x1 + width / 2;
  const centery = y1 + height / 2;
  return {
    id,
    type: 'ellipse',
    x1,
    y1,
    x2,
    y2,
    offsetX: 0,
    offsetY: 0,
    roughElement: roughGeneratopr.ellipse(centerx, centery, width, height, {
      stroke: color,
      fill: color,
      ...options,
    }),
    color,
    options,
  };
}

export function createImage(
  id: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  image: string | ArrayBuffer,
): IImageElement {
  return {
    id,
    type: 'image',
    x1,
    y1,
    x2,
    y2,
    image,
    offsetX: 0,
    offsetY: 0,
    color: 'none',
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
  image?: string | ArrayBuffer,
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
  if (type === 'circle') {
    return createCircle(id, x1, y1, x2, y2, roughGeneratopr, color, options);
  }
  if (type === 'ellipse') {
    return createEllipse(id, x1, y1, x2, y2, roughGeneratopr, color, options);
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
  if (type === 'image' && image) {
    return {
      id,
      type,
      x1,
      y1,
      x2,
      y2,
      image,
      offsetX: 0,
      offsetY: 0,
      color,
    };
  }

  return null;
};

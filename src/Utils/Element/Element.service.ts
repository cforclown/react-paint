import Element, { ICreateElementParams } from './Element';
import ImageElement from './Image/Image';
import Pencil from './Pencil/Pencil';
import Circle from './Shape/Circle';
import Ellipse from './Shape/Ellipse';
import Line from './Shape/Line';
import Rectangle from './Shape/Rectangle';
import Triangle from './Shape/Triangle';
import TextElement from './Text/Text';

const ShapeElementTypes = ['line', 'rectangle', 'triangle', 'circle', 'ellipse'] as const;
export type ShapeElementType = (typeof ShapeElementTypes)[number];
export const isShapeElementType = (type: any): type is ShapeElementType => ShapeElementTypes.includes(type);

const ElementTypes = [...ShapeElementTypes, 'pencil', 'text', 'image'] as const;
export type ElementType = (typeof ElementTypes)[number];
export const isElementType = (type: any): type is ElementType => ElementTypes.includes(type);

const ToolTypes = ['selection', ...ElementTypes] as const;
export type ToolType = (typeof ToolTypes)[number];
export const isToolType = (tool: any): tool is ToolType => ToolTypes.includes(tool);

export const ElementGenerator: Record<ElementType, (params: ICreateElementParams) => Element> = {
  line: (params: ICreateElementParams) => Line.create(params),
  rectangle: (params: ICreateElementParams) => Rectangle.create(params),
  triangle: (params: ICreateElementParams) => Triangle.create(params),
  circle: (params: ICreateElementParams) => Circle.create(params),
  ellipse: (params: ICreateElementParams) => Ellipse.create(params),
  pencil: (params: ICreateElementParams) => Pencil.create(params),
  text: (params: ICreateElementParams) => TextElement.create(params),
  image: (params: ICreateElementParams) => ImageElement.create(params),
};

export const generateElement = (params: ICreateElementParams): Element => ElementGenerator[params.type](params);

export const ElementDefaultNames: Record<ElementType, string> = {
  line: 'Line',
  rectangle: 'Rectangle',
  triangle: 'Triangle',
  circle: 'Circle',
  ellipse: 'Ellipse',
  pencil: 'Pencil',
  text: 'Text',
  image: 'Image',
};

export const generateElementName = (elements: Element[], tool: ElementType): string => {
  const sameTypeElement = elements.filter((e) => e.type === tool);
  return `${ElementDefaultNames[tool]} ${sameTypeElement.length + 1}`;
};

export const generateElementId = (length = 8): string => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

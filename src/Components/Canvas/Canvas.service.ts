import getStroke from 'perfect-freehand';
import { RoughCanvas } from 'roughjs/bin/canvas';
import {
  IElementCoordinate, IPoint, PositionType, TypeElement, isShapeElementType, ISize,
} from '../../Utils/Element/Element.service';

const SelectionToolActions = ['none', 'moving', 'resizing'] as const;
export type SelectionToolAction = (typeof SelectionToolActions)[number];

const CanvasActions = ['drawing', 'writing', ...SelectionToolActions] as const;
export type CanvasAction = (typeof CanvasActions)[number];

export const onLine = (lineStart: IPoint, lineEnd: IPoint, reference: IPoint, maxDistance = 1): 'inside' | null => {
  const offset = distance(lineStart, lineEnd) - (distance(lineStart, reference) + distance(lineEnd, reference));
  return Math.abs(offset) < maxDistance ? 'inside' : null;
};

export const distance = (a: IPoint, b: IPoint): number => Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);

export const nearPoint = (
  reference: IPoint,
  point: IPoint,
  name: string,
): string | null => (Math.abs(reference.x - point.x) < 5 && Math.abs(reference.y - point.y) < 5 ? name : null);

const positionWithinElement = (reference: IPoint, element: TypeElement): string | null => {
  const { type } = element;
  const {
    x1, y1, x2, y2,
  } = element;
  const topLeftPoint = { x: x1, y: y1 };
  const topRightPoint = { x: x2, y: y1 };
  const bottomRightPoint = { x: x2, y: y2 };
  const bottomLeftPoint = { x: x1, y: y2 };

  if (type === 'line') {
    const on = onLine(topLeftPoint, bottomRightPoint, reference);
    const start = nearPoint(reference, topLeftPoint, 'start');
    const end = nearPoint(reference, bottomRightPoint, 'end');
    return start || end || on;
  }
  if (type === 'rectangle' || type === 'triangle' || type === 'circle' || type === 'ellipse') {
    const topLeft = nearPoint(reference, topLeftPoint, 'tl');
    const topRight = nearPoint(reference, topRightPoint, 'tr');
    const bottomRight = nearPoint(reference, bottomRightPoint, 'br');
    const bottomLeft = nearPoint(reference, bottomLeftPoint, 'bl');
    const inside = reference.x >= x1 && reference.x <= x2 && reference.y >= y1 && reference.y <= y2 ? 'inside' : null;
    return topLeft || topRight || bottomLeft || bottomRight || inside;
  }
  if (type === 'pencil') {
    const betweenAnyPoint = element.points.some((point, index) => {
      const nextPoint = element.points[index + 1];
      if (!nextPoint) return false;
      return onLine(point, nextPoint, reference, element.options?.strokeWidth ?? 5) != null;
    });
    return betweenAnyPoint ? 'inside' : null;
  }
  if (type === 'text') {
    return reference.x >= x1 && reference.x <= x2 && reference.y >= y1 && reference.y <= y2 ? 'inside' : null;
  }
  if (type === 'image') {
    const topLeft = nearPoint(reference, topLeftPoint, 'tl');
    const topRight = nearPoint(reference, topRightPoint, 'tr');
    const bottomRight = nearPoint(reference, bottomRightPoint, 'br');
    const bottomLeft = nearPoint(reference, bottomLeftPoint, 'bl');
    const inside = reference.x >= x1 && reference.x <= x2 && reference.y >= y1 && reference.y <= y2 ? 'inside' : null;
    return topLeft || topRight || bottomLeft || bottomRight || inside;
  }

  // eslint-disable-next-line no-console
  console.error('positionWithinElement:', 'params: (', reference, JSON.stringify(element), ') error: type is not recognized');
  return null;
};

export const getElementAtPosition = (
  pointReference: IPoint,
  elements: TypeElement[],
): TypeElement | undefined => elements.map((element) => ({ ...element, position: positionWithinElement(pointReference, element) })).find((element) => !!element.position);

export const adjustElementCoordinates = (element: TypeElement): IElementCoordinate => {
  if (element.type === 'pencil') {
    return {
      x1: 0,
      y1: 0,
      x2: 0,
      y2: 0,
    };
  }

  const {
    type, x1, y1, x2, y2,
  } = element;
  if (isShapeElementType(type)) {
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

const getSvgPathFromStroke = (stroke: number[][]): string => {
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
    case 'circle':
    case 'ellipse':
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
    case 'image':
      // eslint-disable-next-line no-case-declarations
      const image = document.getElementById(`image-${element.id}`) as HTMLCanvasElement | null;
      if (!image) {
        throw new Error(`ON_DRAW: element-id: ${element.id} ERROR: image not found`);
      }
      context.drawImage(image, element.x1, element.y1, element.x2 - element.x1, element.y2 - element.y1);
      break;
    default:
      throw new Error(`Type not recognised: ${JSON.stringify(element)}`);
  }
};

export const adjustmentRequired = (type: string): boolean => isShapeElementType(type);

export const centerOf = (rect: ISize): IPoint => ({
  x: rect.width / 2,
  y: rect.height / 2,
});

export const putToCenterOf = (rect: ISize, ref: ISize): IPoint => ({
  x: ref.width / 2 - rect.width / 2,
  y: ref.height / 2 - rect.height / 2,
});

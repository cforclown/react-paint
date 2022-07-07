import getStroke from 'perfect-freehand';
import { RoughCanvas } from 'roughjs/bin/canvas';
import {
  IPoint, IRect, onLine,
} from '../../Common';
import Element, { ICreateElementParams, IUpdateElementParams } from '../Element';

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

class Pencil extends Element {
  static create(params: ICreateElementParams): Element {
    return new Pencil(params.id, params.name, params.rect, params.color, params.options);
  }

  rect: IRect;

  points: IPoint[];

  offsets: IPoint[];

  constructor(
    id: string,
    name:string,
    rect: IRect,
    color: string,
    options: Record<string, any>,
  ) {
    super(id, name, 'pencil', rect, color, options);
    this.rect = rect;
    this.points = [{
      x: rect.x,
      y: rect.y,
    }];
    this.offsets = [];
  }

  // PARENT METHODs --------------------------------------------------------------------
  update(params: IUpdateElementParams): void {
    this.color = params.color ?? this.color;
    this.options = params.options ?? this.options;
    this.points = params.points ?? this.points;
    const minX = Math.min(...this.points.map((p) => p.x));
    const minY = Math.min(...this.points.map((p) => p.y));
    this.rect = {
      x: minX,
      y: minY,
      width: Math.max(...this.points.map((p) => p.x)) - minX,
      height: Math.max(...this.points.map((p) => p.y)) - minY,
    };
  }

  draw(_: RoughCanvas, context2d: CanvasRenderingContext2D): void {
    // eslint-disable-next-line no-param-reassign
    context2d.fillStyle = this.color;
    context2d.fill(new Path2D(getSvgPathFromStroke(getStroke(this.points))));
  }

  isHover(mousePos: IPoint): boolean {
    const betweenAnyPoint = this.points.some((point, index) => {
      const nextPoint = this.points[index + 1];
      if (!nextPoint) return false;
      return onLine(point, nextPoint, mousePos, this.options?.strokeWidth ?? 5);
    });
    return betweenAnyPoint;
  }

  // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-empty-function
  adjustRect(): void {}

  move(to: IPoint, offset: IPoint | IPoint[]): void {
    if (!Array.isArray(offset) && this.points.length !== (offset as unknown as IPoint[]).length) {
      return;
    }

    const offsets = offset as IPoint[];
    this.points.forEach((_, index) => ({
      x: to.x - offsets[index].x,
      y: to.y - offsets[index].y,
    }));
  }
  // -----------------------------------------------------------------------------------
}

export default Pencil;

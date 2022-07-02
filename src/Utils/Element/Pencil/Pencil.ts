import getStroke from 'perfect-freehand';
import Element, { IUpdateElementParams } from '../Element';
import {
  IPoint, IRect, ISize, ShapeElementType,
} from '../Element.service';

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

abstract class Pencil extends Element<CanvasRenderingContext2D> {
  rect: IRect;

  points: IPoint[];

  offsets: IPoint[];

  constructor(
    id: number,
    shapeType: ShapeElementType,
    drawerEngine: CanvasRenderingContext2D,
    rect: IRect,
    color: string,
    options: Record<string, any>,
  ) {
    super(id, shapeType, drawerEngine, color, options);
    this.rect = rect;
    this.points = [];
    this.offsets = [];
  }

  // PARENT METHODs --------------------------------------------------------------------
  update(params: IUpdateElementParams): void {
    this.color = params.color;
    this.options = params.options;
    this.rect = {
      x: params.rect.x,
      y: params.rect.y,
      width: params.rect.width ?? this.rect.width,
      height: params.rect.height ?? this.rect.height,
    };
    this.points = [
      ...this.points,
      { x: params.rect.x, y: params.rect.y },
    ];
  }

  draw(): void {
    this.drawerEngine.fillStyle = this.color;
    this.drawerEngine.fill(new Path2D(getSvgPathFromStroke(getStroke(this.points))));
  }
  // -----------------------------------------------------------------------------------

  topLeft(): IPoint {
    return {
      x: this.rect.x,
      y: this.rect.y,
    };
  }

  centerPos(): IPoint {
    return {
      x: this.rect.x + (this.rect.width / 2),
      y: this.rect.y + (this.rect.height / 2),
    };
  }

  size(): ISize {
    return {
      width: this.rect.width,
      height: this.rect.height,
    };
  }
}

export default Pencil;

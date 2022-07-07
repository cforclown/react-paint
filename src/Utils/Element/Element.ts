import { RoughCanvas } from 'roughjs/bin/canvas';
import { RoughGenerator } from 'roughjs/bin/generator';
import { IPoint, IRect, ISize } from '../Common';
import { ElementType } from './Element.service';

export type DrawerEngine = RoughCanvas | CanvasRenderingContext2D | undefined

export interface IUpdateElementParams {
  id: string;
  rect?: IRect;
  points?: IPoint[];
  rot?: number;
  text?: string;
  color?: string;
  options?: Record<string, any>;
}

export interface ICreateElementParams {
  id: string;
  name: string;
  type: ElementType;

  roughGenerator: RoughGenerator;

  image?: string | ArrayBuffer;
  rect: IRect;
  color: string;
  options: Record<string, any>;
}

abstract class Element {
  id: string;

  name: string;

  type: string;

  rect: IRect;

  color: string;

  options: Record<string, any>;

  constructor(id: string, name: string, type: ElementType, rect: IRect, color: string, options: Record<string, any>) {
    this.id = id;
    this.type = type;
    this.name = name;
    this.rect = rect;
    this.color = color;
    this.options = options;
  }

  abstract draw(roughCanvas: RoughCanvas, context2d: CanvasRenderingContext2D): void;

  abstract update(params: IUpdateElementParams): void;

  abstract isHover(mousePos: IPoint): boolean;

  abstract adjustRect(): void;

  abstract move(to: IPoint, offset: IPoint | IPoint[]): void;

  topLeft(): IPoint {
    return {
      x: this.rect.x,
      y: this.rect.y,
    };
  }

  topRight(): IPoint {
    return {
      x: this.rect.x + this.rect.width,
      y: this.rect.y,
    };
  }

  bottomRight(): IPoint {
    return {
      x: this.rect.x + this.rect.width,
      y: this.rect.y + this.rect.height,
    };
  }

  bottomLeft(): IPoint {
    return {
      x: this.rect.x,
      y: this.rect.y + this.rect.height,
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

  resize(resizeAction: string, reference: IPoint): void {
    const rectOffset = {
      x: this.rect.x - reference.x,
      y: this.rect.y - reference.y,
    };
    switch (resizeAction) {
      case 'nw-resize':
        this.rect = {
          x: reference.x,
          y: reference.y,
          width: this.rect.width + rectOffset.x,
          height: this.rect.height + rectOffset.y,
        };
        break;
      case 'n-resize':
        this.rect = {
          x: this.rect.x,
          y: reference.y,
          width: this.rect.width,
          height: this.rect.height + rectOffset.y,
        };
        break;
      case 'ne-resize':
        this.rect = {
          x: this.rect.x,
          y: reference.y,
          width: reference.x - this.rect.x,
          height: this.rect.height + rectOffset.y,
        };
        break;
      case 'w-resize':
        this.rect = {
          ...this.rect,
          x: reference.x,
          width: this.rect.width + rectOffset.x,
        };
        break;
      case 'e-resize':
        this.rect = {
          ...this.rect,
          width: reference.x - this.rect.x,
        };
        break;
      case 'sw-resize':
        this.rect = {
          ...this.rect,
          x: reference.x,
          width: this.rect.width + rectOffset.x,
          height: reference.y - this.rect.y,
        };
        break;
      case 's-resize':
        this.rect = {
          ...this.rect,
          height: reference.y - this.rect.y,
        };
        break;
      case 'se-resize':
        this.rect = {
          ...this.rect,
          width: reference.x - this.rect.x,
          height: reference.y - this.rect.y,
        };
        break;
      default:
        break; // should not really get here...
    }
  }
}

export default Element;

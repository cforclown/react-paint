import { RoughCanvas } from 'roughjs/bin/canvas';
import { ElementType, IPoint } from './Element.service';

export interface IUpdateElementParams {
  id: number;
  type: ElementType;
  rect: IPoint & {
    width?: number;
    height?: number;
  };
  rot?: number;
  text?: string;
  color: string;
  options: Record<string, any>;
}

abstract class Element<D extends RoughCanvas | CanvasRenderingContext2D | undefined> {
  id: number;

  type: string;

  drawerEngine: D;

  color: string;

  options: Record<string, any>;

  constructor(id: number, type: ElementType, drawerEngine: D, color: string, options: Record<string, any>) {
    this.id = id;
    this.type = type;
    this.drawerEngine = drawerEngine;
    this.color = color;
    this.options = options;
  }

  abstract draw(): void;

  abstract update(params: IUpdateElementParams): void;
}

export default Element;

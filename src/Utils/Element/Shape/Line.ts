import { Drawable } from 'roughjs/bin/core';
import { RoughGenerator } from 'roughjs/bin/generator';
import {
  IPoint, IRect, nearPoint, onLine,
} from '../../Common';
import { ICreateElementParams } from '../Element';
import { ILineOptions } from '../ElementOption/ElementOption.service';
import Shape from './Shape';

function generateLine(generator: RoughGenerator, rect: IRect, color: string, options: ILineOptions): Drawable {
  return generator.line(
    rect.x,
    rect.y,
    rect.x + rect.width,
    rect.y + rect.height,
    {
      stroke: color,
      fill: color,
      ...options,
    },
  );
}

class Line extends Shape {
  static create(params: ICreateElementParams): Shape {
    return new Line(params.id, params.name, params.roughGenerator, params.rect, params.color, params.options);
  }

  constructor(id: string, name:string, generator: RoughGenerator, rect: IRect, color: string, options: ILineOptions) {
    super(id, name, 'line', generator, generateLine(generator, rect, color, options), rect, color, options);
  }

  updateDrawable(): void {
    this.drawable = generateLine(this.generator, this.rect, this.color, this.options);
  }

  isHoverCalculation(mousePos: IPoint): boolean {
    const on = onLine(this.topLeft(), this.bottomRight(), mousePos);
    const start = nearPoint(mousePos, this.topLeft());
    const end = nearPoint(mousePos, this.bottomRight());
    return start || end || on;
  }

  // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-empty-function
  adjustRect(): void {}
}

export default Line;

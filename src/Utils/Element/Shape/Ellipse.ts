import { Drawable } from 'roughjs/bin/core';
import { RoughGenerator } from 'roughjs/bin/generator';
import { IPoint, IRect, nearPoint } from '../../Common';
import { ICreateElementParams } from '../Element';
import { ILineOptions } from '../ElementOption/ElementOption.service';
import Shape from './Shape';

function generateEllipse(generator: RoughGenerator, rect: IRect, color: string, options: ILineOptions): Drawable {
  return generator.ellipse(rect.x + rect.width / 2, rect.y + rect.height / 2, rect.width, rect.height, {
    stroke: color,
    fill: color,
    ...options,
  });
}

class Ellipse extends Shape {
  static create(params: ICreateElementParams): Shape {
    return new Ellipse(params.id, params.name, params.roughGenerator, params.rect, params.color, params.options);
  }

  constructor(id: string, name:string, generator: RoughGenerator, rect: IRect, color: string, options: ILineOptions) {
    super(id, name, 'ellipse', generator, generateEllipse(generator, rect, color, options), rect, color, options);
  }

  updateDrawable(): void {
    this.drawable = generateEllipse(this.generator, this.rect, this.color, this.options);
  }

  // TODO: change to real ellipse calculation
  isHoverCalculation(mousePos: IPoint): boolean {
    const topLeft = nearPoint(mousePos, this.topLeft());
    const topRight = nearPoint(mousePos, this.topRight());
    const bottomRight = nearPoint(mousePos, this.bottomRight());
    const bottomLeft = nearPoint(mousePos, this.bottomLeft());
    const inside = mousePos.x >= this.rect.x && mousePos.x <= this.rect.x + this.rect.width && mousePos.y >= this.rect.y && mousePos.y <= this.rect.y + this.rect.height;
    return topLeft || topRight || bottomLeft || bottomRight || inside;
  }

  // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-empty-function
  adjustRect(): void {}
}

export default Ellipse;

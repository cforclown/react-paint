import { Drawable } from 'roughjs/bin/core';
import { RoughGenerator } from 'roughjs/bin/generator';
import { IPoint, IRect, nearPoint } from '../../Common';
import { ICreateElementParams } from '../Element';
import { ILineOptions } from '../ElementOption/ElementOption.service';
import Shape from './Shape';

function generateTriangle(generator: RoughGenerator, rect: IRect, color: string, options: ILineOptions): Drawable {
  return generator.polygon([
    [rect.x + rect.width / 2, rect.y],
    [rect.x + rect.width, rect.y + rect.height],
    [rect.x, rect.y + rect.height],
  ], {
    stroke: color,
    fill: color,
    ...options,
  });
}

class Triangle extends Shape {
  static create(params: ICreateElementParams): Shape {
    return new Triangle(params.id, params.name, params.roughGenerator, params.rect, params.color, params.options);
  }

  constructor(id: string, name:string, generator: RoughGenerator, rect: IRect, color: string, options: ILineOptions) {
    super(id, name, 'triangle', generator, generateTriangle(generator, rect, color, options), rect, color, options);
  }

  // TODO: UPDATE THIS LATER
  updateDrawable(): void {
    this.drawable = generateTriangle(this.generator, this.rect, this.color, this.options);
  }

  // TODO - change real triangle calculation
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

export default Triangle;

import { RoughCanvas } from 'roughjs/bin/canvas';
import { Drawable } from 'roughjs/bin/core';
import { RoughGenerator } from 'roughjs/bin/generator';
import { IRect } from '../Element.service';
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
  constructor(id: number, drawerEngine: RoughCanvas, generator: RoughGenerator, rect: IRect, color: string, options: ILineOptions) {
    super(id, 'triangle', drawerEngine, generator, generateTriangle(generator, rect, color, options), rect, color, options);
  }

  updateDrawable(): void {
    this.drawable = generateTriangle(this.generator, this.rect, this.color, this.options);
  }
}

export default Triangle;

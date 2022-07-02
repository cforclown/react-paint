import { RoughCanvas } from 'roughjs/bin/canvas';
import { Drawable } from 'roughjs/bin/core';
import { RoughGenerator } from 'roughjs/bin/generator';
import { IPoint, IRect } from '../Element.service';
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
  constructor(id: number, drawerEngine: RoughCanvas, generator: RoughGenerator, rect: IRect, color: string, options: ILineOptions) {
    super(id, 'line', drawerEngine, generator, generateLine(generator, rect, color, options), rect, color, options);
  }

  updateDrawable(): void {
    this.drawable = generateLine(this.generator, this.rect, this.color, this.options);
  }
}

export default Line;

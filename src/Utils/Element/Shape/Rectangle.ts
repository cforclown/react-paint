import { RoughCanvas } from 'roughjs/bin/canvas';
import { Drawable } from 'roughjs/bin/core';
import { RoughGenerator } from 'roughjs/bin/generator';
import { IRect } from '../Element.service';
import { ILineOptions } from '../ElementOption/ElementOption.service';
import Shape from './Shape';

function generateRectangle(generator: RoughGenerator, rect: IRect, color: string, options: ILineOptions): Drawable {
  return generator.rectangle(
    rect.x,
    rect.y,
    rect.width,
    rect.height,
    {
      stroke: color,
      fill: color,
      ...options,
    },
  );
}

class Rectangle extends Shape {
  constructor(id: number, drawerEngine: RoughCanvas, generator: RoughGenerator, rect: IRect, color: string, options: ILineOptions) {
    super(id, 'rectangle', drawerEngine, generator, generateRectangle(generator, rect, color, options), rect, color, options);
  }

  updateDrawable(): void {
    this.drawable = generateRectangle(this.generator, this.rect, this.color, this.options);
  }
}

export default Rectangle;

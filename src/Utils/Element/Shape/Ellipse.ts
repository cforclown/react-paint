import { RoughCanvas } from 'roughjs/bin/canvas';
import { Drawable } from 'roughjs/bin/core';
import { RoughGenerator } from 'roughjs/bin/generator';
import { IRect } from '../Element.service';
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
  constructor(id: number, drawerEngine: RoughCanvas, generator: RoughGenerator, rect: IRect, color: string, options: ILineOptions) {
    super(id, 'ellipse', drawerEngine, generator, generateEllipse(generator, rect, color, options), rect, color, options);
  }

  updateDrawable(): void {
    this.drawable = generateEllipse(this.generator, this.rect, this.color, this.options);
  }
}

export default Ellipse;

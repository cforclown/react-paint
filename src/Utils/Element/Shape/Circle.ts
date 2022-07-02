import { RoughCanvas } from 'roughjs/bin/canvas';
import { Drawable } from 'roughjs/bin/core';
import { RoughGenerator } from 'roughjs/bin/generator';
import { IRect } from '../Element.service';
import { ILineOptions } from '../ElementOption/ElementOption.service';
import Shape from './Shape';

function generateCircle(generator: RoughGenerator, rect: IRect, color: string, options: ILineOptions): Drawable {
  const diameter = Math.min(rect.width, rect.height);
  const centerx = rect.x + diameter / 2;
  const centery = rect.y + diameter / 2;
  return generator.circle(centerx, centery, diameter, {
    stroke: color,
    fill: color,
    ...options,
  });
}

class Circle extends Shape {
  constructor(id: number, drawerEngine: RoughCanvas, generator: RoughGenerator, rect: IRect, color: string, options: ILineOptions) {
    super(id, 'circle', drawerEngine, generator, generateCircle(generator, rect, color, options), rect, color, options);
  }

  updateDrawable(): void {
    this.drawable = generateCircle(this.generator, this.rect, this.color, this.options);
  }
}

export default Circle;

import { Drawable } from 'roughjs/bin/core';
import { RoughGenerator } from 'roughjs/bin/generator';
import { IPoint, IRect, nearPoint } from '../../Common';
import { ICreateElementParams } from '../Element';
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
  static create(params: ICreateElementParams): Shape {
    return new Rectangle(params.id, params.name, params.roughGenerator, params.rect, params.color, params.options);
  }

  constructor(id: string, name:string, generator: RoughGenerator, rect: IRect, color: string, options: ILineOptions) {
    super(id, name, 'rectangle', generator, generateRectangle(generator, rect, color, options), rect, color, options);
  }

  updateDrawable(): void {
    this.drawable = generateRectangle(this.generator, this.rect, this.color, this.options);
  }

  isHoverCalculation(mousePos: IPoint): boolean {
    const topLeft = nearPoint(mousePos, this.topLeft());
    const topRight = nearPoint(mousePos, this.topRight());
    const bottomRight = nearPoint(mousePos, this.bottomRight());
    const bottomLeft = nearPoint(mousePos, this.bottomLeft());
    const inside = mousePos.x >= this.rect.x && mousePos.x <= this.rect.x + this.rect.width && mousePos.y >= this.rect.y && mousePos.y <= this.rect.y + this.rect.height;
    return topLeft || topRight || bottomLeft || bottomRight || inside;
  }

  adjustRect(): void {
    const minX = Math.min(this.rect.x, this.bottomRight().x);
    const maxX = Math.max(this.rect.x, this.bottomRight().x);
    const minY = Math.min(this.rect.y, this.bottomRight().y);
    const maxY = Math.max(this.rect.y, this.bottomRight().y);

    this.rect = {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
    };
  }
}

export default Rectangle;

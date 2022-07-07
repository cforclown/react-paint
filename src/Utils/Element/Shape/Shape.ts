import { RoughCanvas } from 'roughjs/bin/canvas';
import { Drawable } from 'roughjs/bin/core';
import { RoughGenerator } from 'roughjs/bin/generator';
import { IPoint, IRect } from '../../Common';
import Element, { IUpdateElementParams } from '../Element';
import { ShapeElementType } from '../Element.service';

abstract class Shape extends Element {
  drawable: Drawable;

  rect: IRect;

  generator: RoughGenerator;

  constructor(
    id: string,
    name: string,
    shapeType: ShapeElementType,
    generator: RoughGenerator,
    drawable: Drawable,
    rect: IRect,
    color: string,
    options: Record<string, any>,
  ) {
    super(id, name, shapeType, rect, color, options);
    this.generator = generator;
    this.drawable = drawable;
    this.rect = rect;
  }

  abstract updateDrawable(params: IUpdateElementParams): void

  abstract isHoverCalculation(mousePos: IPoint): boolean

  abstract adjustRect(): void

  // PARENT METHODs --------------------------------------------------------------------
  update(params: IUpdateElementParams): void {
    this.color = params.color ?? this.color;
    this.options = params.options ?? this.options;
    this.rect = params.rect ?? this.rect;
    this.updateDrawable(params);
  }

  draw(roughCanvas: RoughCanvas): void {
    roughCanvas.draw(this.drawable);
  }

  isHover(mousePos: IPoint): boolean {
    return this.isHoverCalculation(mousePos);
  }

  move(to: IPoint, offset: IPoint | IPoint[]): void {
    if (Array.isArray(offset)) {
      return;
    }
    this.rect = {
      ...this.rect,
      x: to.x - offset.x,
      y: to.y - offset.y,
    };
  }
  // -----------------------------------------------------------------------------------
}

export default Shape;

import { RoughCanvas } from 'roughjs/bin/canvas';
import { Drawable } from 'roughjs/bin/core';
import { RoughGenerator } from 'roughjs/bin/generator';
import Element, { IUpdateElementParams } from '../Element';
import {
  IPoint, IRect, ISize, ShapeElementType,
} from '../Element.service';

abstract class Shape extends Element<RoughCanvas> {
  drawable: Drawable;

  rect: IRect;

  generator: RoughGenerator;

  offset: IPoint;

  constructor(
    id: number,
    shapeType: ShapeElementType,
    drawerEngine: RoughCanvas,
    generator: RoughGenerator,
    drawable: Drawable,
    rect: IRect,
    color: string,
    options: Record<string, any>,
  ) {
    super(id, shapeType, drawerEngine, color, options);
    this.generator = generator;
    this.drawable = drawable;
    this.rect = rect;
    this.offset = {
      x: 0,
      y: 0,
    };
  }

  abstract updateDrawable(params: IUpdateElementParams): void

  // PARENT METHODs --------------------------------------------------------------------
  update(params: IUpdateElementParams): void {
    this.color = params.color;
    this.options = params.options;
    this.rect = {
      x: params.rect.x,
      y: params.rect.y,
      width: params.rect.width ?? this.rect.width,
      height: params.rect.height ?? this.rect.height,
    };
    this.updateDrawable(params);
  }

  draw(): void {
    this.drawerEngine.draw(this.drawable);
  }
  // -----------------------------------------------------------------------------------

  topLeft(): IPoint {
    return {
      x: this.rect.x,
      y: this.rect.y,
    };
  }

  bottomRight(): IPoint {
    return {
      x: this.rect.x + this.rect.width,
      y: this.rect.y + this.rect.height,
    };
  }

  centerPos(): IPoint {
    return {
      x: this.rect.x + (this.rect.width / 2),
      y: this.rect.y + (this.rect.height / 2),
    };
  }

  size(): ISize {
    return {
      width: this.rect.width,
      height: this.rect.height,
    };
  }

  setOffset(offset: IPoint): void {
    this.offset = offset;
  }
}

export default Shape;

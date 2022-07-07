import { RoughCanvas } from 'roughjs/bin/canvas';
import { IPoint, IRect, nearPoint } from '../../Common';
import Element, { ICreateElementParams, IUpdateElementParams } from '../Element';

class TextElement extends Element {
  static create(params: ICreateElementParams): Element {
    return new TextElement(params.id, params.name, params.rect, params.color, params.options);
  }

  text: string;

  offset: IPoint;

  constructor(
    id: string,
    name:string,
    rect: IRect,
    color: string,
    options: Record<string, any>,
  ) {
    super(id, name, 'text', rect, color, options);
    this.text = '';
    this.rect = rect;
    this.offset = {
      x: 0,
      y: 0,
    };
  }

  // PARENT METHODs --------------------------------------------------------------------
  update(params: IUpdateElementParams): void {
    this.text = params.text ?? this.text;
    this.color = params.color ?? this.color;
    this.options = params.options ?? this.options;
    this.rect = params.rect ?? this.rect;
  }

  draw(_: RoughCanvas, context2d: CanvasRenderingContext2D): void {
    // eslint-disable-next-line no-param-reassign
    context2d.fillStyle = this.color;
    this.text.split('\n').forEach((text, index) => context2d.fillText(text, this.rect.x, this.rect.y + ((this.options.lineHeight ?? 16) * index)));
  }

  isHover(mousePos: IPoint): boolean {
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

export default TextElement;

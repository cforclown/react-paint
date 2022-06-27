export interface IDrawAction {
  id: string;
  name: string;
}

export type ElementOptionTypeValue = number | string;
export interface IElementOptionType {
  value: ElementOptionTypeValue;
  default: ElementOptionTypeValue;
}

export interface IElementOption {
  id: string;
  name: string;
  type: IElementOptionType;
}

export type IFillStyle = 'hachure' | 'solid' | 'zigzag' | 'cross-hatch' | 'dots' | 'sunburst' | 'dashed' | 'zigzag-line'

export interface ILineOptions {
  strokeWidth?: number;
  roughness?: number;
}

export interface IBasicOptions {
  strokeWidth?: number;
  roughness?: number;
  fill?: string;
  fillWeight?: number;
  fillStyle?: IFillStyle;
}

export interface IRectangleOptions extends IBasicOptions {}

export interface ITriangleOptions extends IBasicOptions {}

export interface ICircleOptions extends IBasicOptions {}

export interface IEllipseOptions extends IBasicOptions {}

export interface IPencilOptions extends IBasicOptions {}

export interface ITextOptions {
  fontSize: number;
  fontWeight: 'normal' | 'bold';
  fontStyle?: 'italic' | 'underline';
}

export type ToolOptions = ILineOptions | IRectangleOptions | IPencilOptions | ITextOptions

export interface IDrawAction {
  id: string;
  name: string;
}

export interface ILineOptions {
  strokeWidth?: number;
}

export type IFillStyle = 'hachure' | 'solid' | 'zigzag' | 'cross-hatch' | 'dots' | 'sunburst' | 'dashed' | 'zigzag-line'

export interface IRectangleOptions {
  strokeWidth?: number;
  fill?: string;
  fillWeight?: number;
  fillStyle?: IFillStyle;
}

export interface ITriangleOptions {
  strokeWidth?: number;
  fill?: string;
  fillWeight?: number;
  fillStyle?: IFillStyle;
}

export interface IPencilOptions {
  strokeWidth?: number;
}

export interface ITextOptions {
  fontSize: number;
  fontWeight: 'normal' | 'bold';
  fontStyle?: 'italic' | 'underline';
}

export type ToolOptions = ILineOptions | IRectangleOptions | IPencilOptions | ITextOptions

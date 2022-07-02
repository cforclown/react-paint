import { IFormField } from '../../Form/Form';
import { ElementType, TypeElement } from '../Element.service';

export type IFillStyle = 'hachure' | 'solid' | 'zigzag' | 'cross-hatch' | 'dots' | 'sunburst' | 'dashed' | 'zigzag-line'

export interface IBasicOptions {
  bowing?: 0;
  strokeWidth?: number;
  roughness?: number;
  fill?: string;
  fillWeight?: number;
  fillStyle?: IFillStyle;
}

export type ILineOptions = Omit<IBasicOptions, 'fill' | 'fillWeight' | 'fillStyle'>

export interface IRectangleOptions extends IBasicOptions {}

export interface ITriangleOptions extends IBasicOptions {}

export interface ICircleOptions extends IBasicOptions {}

export interface IEllipseOptions extends IBasicOptions {}

export interface IPencilOptions extends IBasicOptions {}

export interface IImageOptions extends IBasicOptions {}

export interface ITextOptions {
  fontSize: number;
  fontWeight: 'normal' | 'bold';
  fontStyle?: 'italic' | 'underline';
}

export type ToolOptions = ILineOptions | IRectangleOptions | IPencilOptions | ITextOptions

const optionBowingField: IFormField = {
  id: 'bowing',
  name: 'Bowing',
  type: {
    value: 'enum',
    default: '0',
    options: [
      { id: '0', name: '0' },
      { id: '1', name: '1' },
    ],
  },
};

const optionStrokeWidthField: IFormField = {
  id: 'strokeWidth',
  name: 'Stroke width',
  type: {
    value: 'number',
    default: 4,
  },
};
const optionRoughnessField: IFormField = {
  id: 'roughness',
  name: 'Roughness',
  type: {
    value: 'number',
    default: 4,
  },
};
const optionFillField: IFormField = {
  id: 'fill',
  name: 'Fill',
  type: {
    value: 'color',
    default: '#000000',
  },
};
const optionFillWeightField: IFormField = {
  id: 'fillWeight',
  name: 'Fill Weight',
  type: {
    value: 'number',
    default: 5,
  },
};
const optionFillStyleField: IFormField = {
  id: 'fillStyle',
  name: 'Fill Style',
  type: {
    value: 'enum',
    default: 'solid',
    options: [
      { id: 'solid', name: 'Solid' },
      { id: 'zigzag', name: 'zigzag' },
      { id: 'cross-hatch', name: 'Cross Hatch' },
      { id: 'dots', name: 'Dots' },
      { id: 'zigzag-line', name: 'Zigzag Line' },
    ],
  },
};

export type ElementOptions = Record<ElementType, IFormField[] | undefined>

export const ElementOptionConfigs: ElementOptions = {
  line: [
    optionBowingField,
    optionStrokeWidthField,
    optionRoughnessField,
  ],
  rectangle: [
    optionBowingField,
    optionStrokeWidthField,
    optionRoughnessField,
    optionFillField,
    optionFillWeightField,
    optionFillStyleField,

  ],
  triangle: [
    optionBowingField,
    optionStrokeWidthField,
    optionRoughnessField,
    optionFillField,
    optionFillWeightField,
    optionFillStyleField,
  ],
  circle: [
    optionBowingField,
    optionStrokeWidthField,
    optionRoughnessField,
    optionFillField,
    optionFillWeightField,
    optionFillStyleField,
  ],
  ellipse: [
    optionBowingField,
    optionStrokeWidthField,
    optionRoughnessField,
    optionFillField,
    optionFillWeightField,
    optionFillStyleField,
  ],
  pencil: [
    optionBowingField,
    optionStrokeWidthField,
    optionRoughnessField,
    optionFillField,
    optionFillWeightField,
    optionFillStyleField,
  ],
  text: [
    optionBowingField,
    optionStrokeWidthField,
    optionRoughnessField,
    optionFillField,
    optionFillWeightField,
    optionFillStyleField,
  ],
  image: undefined,
};

export const getElementOptions = (element: TypeElement): Record<string, any> => {
  if (!element.options) {
    return {};
  }

  return element.options;
};

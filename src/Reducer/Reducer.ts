import {
  ICircleOptions,
  IEllipseOptions,
  IImageOptions,
  ILineOptions, IPencilOptions, IRectangleOptions, ITextOptions, ITriangleOptions,
} from '../Utils/Element/ElementOption/ElementOption.service';
import { ToolType } from '../Utils/Element/Element.service';
import { IReducerAction } from './Actions';
import ActionTypes from './ActionTypes';

export interface IState {
  canvasSize: {
    width: number;
    height: number;
  };
  tool: ToolType;
  toolOptions: {
    line: ILineOptions;
    rectangle: IRectangleOptions;
    triangle: ITriangleOptions;
    circle: ICircleOptions;
    ellipse: IEllipseOptions;
    pencil: IPencilOptions;
    text: ITextOptions;
    image: IImageOptions;
  };
  color: string;
  showColorModal: boolean;
}

const defaultState: IState = {
  canvasSize: {
    width: 800,
    height: 600,
  },
  tool: 'rectangle',
  toolOptions: {
    line: {
      bowing: 0,
      strokeWidth: 1,
      roughness: 0,
    },
    rectangle: {
      bowing: 0,
      strokeWidth: 1,
      roughness: 0,
      fillStyle: 'solid',
    },
    triangle: {
      bowing: 0,
      strokeWidth: 1,
      roughness: 0,
      fillStyle: 'solid',
    },
    circle: {
      bowing: 0,
      strokeWidth: 1,
      roughness: 0,
      fillStyle: 'solid',
    },
    ellipse: {
      bowing: 0,
      strokeWidth: 1,
      roughness: 0,
      fillStyle: 'solid',
    },
    pencil: {
      strokeWidth: 4,
    },
    text: {
      fontSize: 20,
      fontWeight: 'normal',
      lineHeight: 24,
      align: 'start',
    },
    image: {},
  },
  color: '#000000',
  showColorModal: false,
};

// eslint-disable-next-line default-param-last
const Reducer = (state: IState = defaultState, action: IReducerAction): any => {
  const newState = { ...state };

  if (action.type === ActionTypes.CHANGE_CANVAS_SIZE) {
    newState.canvasSize = action.param.size;
    return newState;
  }

  if (action.type === ActionTypes.CHANGE_TOOL) {
    newState.tool = action.param.tool;
    return newState;
  }

  if (action.type === ActionTypes.CHANGE_COLOR) {
    newState.color = action.param.color;
    return newState;
  }

  if (action.type === ActionTypes.SHOW_OR_HIDE_COLOR_PICKER) {
    newState.showColorModal = action.param.showColorModal;
    return newState;
  }

  return state;
};

export default Reducer;

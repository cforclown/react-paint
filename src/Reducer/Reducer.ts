import { ToolType } from '../Components/Canvas/Canvas.service';
import {
  ILineOptions, IPencilOptions, IRectangleOptions, ITextOptions, ITriangleOptions,
} from '../Types/Common';
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
    circle: IRectangleOptions;
    triangle: ITriangleOptions;
    pencil: IPencilOptions;
    text: ITextOptions;
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
      strokeWidth: 4,
    },
    rectangle: {
      fillStyle: 'solid',
      strokeWidth: 4,
    },
    circle: {
      fillStyle: 'solid',
      strokeWidth: 4,
    },
    triangle: {
      fillStyle: 'solid',
      strokeWidth: 4,
    },
    pencil: {
      strokeWidth: 8,
    },
    text: {
      fontSize: 20,
      fontWeight: 'normal',
    },
  },
  color: '#FF0000',
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

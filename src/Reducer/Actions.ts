import { ToolType } from '../Components/Canvas/Canvas.service';
import ActionTypes from './ActionTypes';

export interface IReducerAction {
  type: string;
  param: Record<string, any>
}

export function ChangeCanvasSize(size: { width: number; height: number }): IReducerAction {
  return {
    type: ActionTypes.CHANGE_CANVAS_SIZE,
    param: { size },
  };
}

export function ChangeTool(tool: ToolType): IReducerAction {
  return {
    type: ActionTypes.CHANGE_TOOL,
    param: { tool },
  };
}

export function ChangeColor(color: string): IReducerAction {
  return {
    type: ActionTypes.CHANGE_COLOR,
    param: { color },
  };
}

export function ShowOrHideColorPicker(showColorModal: boolean): IReducerAction {
  return {
    type: ActionTypes.SHOW_OR_HIDE_COLOR_PICKER,
    param: { showColorModal },
  };
}

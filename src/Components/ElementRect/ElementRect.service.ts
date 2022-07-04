import { IElementCoordinate, IPoint } from '../../Utils/Element/Element.service';

const SelectionToolActions = ['none', 'moving', 'resizing'] as const;
export type SelectionToolAction = (typeof SelectionToolActions)[number];

const UpResizeActions = ['nw-resize', 'n-resize', 'ne-resize'] as const;
const BottomResizeActions = ['se-resize', 's-resize', 'sw-resize'] as const;
const centerResizeActions = ['e-resize', 'w-resize'] as const;
const ResizeActions = ['none', ...UpResizeActions, ...centerResizeActions, ...BottomResizeActions] as const;
export type ResizeAction = (typeof ResizeActions)[number];

export const resizedCoordinates = (offset: IPoint, coordinates: IElementCoordinate, position?: string | null): IElementCoordinate | null => {
  const {
    x1, y1, x2, y2,
  } = coordinates;
  switch (position) {
    case 'nw-resize':
      return {
        x1: offset.x, y1: offset.y, x2, y2,
      };
    case 'n-resize':
      return {
        x1, y1: offset.y, x2, y2,
      };
    case 'ne-resize':
      return {
        x1, y1: offset.y, x2: offset.x, y2,
      };

    case 'w-resize':
      return {
        x1: offset.x, y1, x2, y2,
      };
    case 'e-resize':
      return {
        x1, y1, x2: offset.x, y2,
      };

    case 'sw-resize':
      return {
        x1: offset.x, y1, x2, y2: offset.y,
      };
    case 's-resize':
      return {
        x1, y1, x2, y2: offset.y,
      };
    case 'se-resize':
      return {
        x1, y1, x2: offset.x, y2: offset.y,
      };
    default:
      return null; // should not really get here...
  }
};

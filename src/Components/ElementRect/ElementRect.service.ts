const SelectionToolActions = ['none', 'moving', 'resizing'] as const;
export type SelectionToolAction = (typeof SelectionToolActions)[number];

const UpResizeActions = ['nw-resize', 'n-resize', 'ne-resize'] as const;
const BottomResizeActions = ['se-resize', 's-resize', 'sw-resize'] as const;
const centerResizeActions = ['e-resize', 'w-resize'] as const;
const ResizeActions = ['none', ...UpResizeActions, ...centerResizeActions, ...BottomResizeActions] as const;
export type ResizeAction = (typeof ResizeActions)[number];

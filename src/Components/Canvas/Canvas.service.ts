const SelectionToolActions = ['none', 'moving', 'resizing'] as const;

const CanvasActions = ['drawing', 'writing', ...SelectionToolActions] as const;
export type CanvasAction = (typeof CanvasActions)[number];

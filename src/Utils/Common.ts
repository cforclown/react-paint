/* eslint-disable no-console */
export interface IPoint {
  x: number;
  y: number;
}

export interface ISize {
  width: number;
  height: number;
}

export interface IRect extends IPoint, ISize {}

export const onLine = (lineStart: IPoint, lineEnd: IPoint, reference: IPoint, maxDistance = 1): boolean => {
  const offset = distance(lineStart, lineEnd) - (distance(lineStart, reference) + distance(lineEnd, reference));
  return Math.abs(offset) < maxDistance;
};

export const distance = (a: IPoint, b: IPoint): number => Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);

export const nearPoint = (
  reference: IPoint,
  point: IPoint,
): boolean => (Math.abs(reference.x - point.x) < 5 && Math.abs(reference.y - point.y) < 5);

export const putToCenterOf = (rect: ISize, ref: ISize): IPoint => ({
  x: ref.width / 2 - rect.width / 2,
  y: ref.height / 2 - rect.height / 2,
});

export async function TraceError(err: Record<string, any>): Promise<void> {
  console.log('=========================================');
  try {
    console.log(`MESSAGE: ${err.message ?? ''}`);
    if (err.stack) {
      console.log('STACKTRACE>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
      console.log(err.stack);
      console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');
    }

    const errorMessage = `
        =========================================
        MESSAGE: ${err.message ?? ''}
        STACKTRACE:
        ${err.stack ?? ''}
        =========================================
    `;
    console.log(errorMessage);
  } catch (error) {
    if (err instanceof Error) {
      console.error(err.message);
    }
  }
  console.error('=========================================');
}

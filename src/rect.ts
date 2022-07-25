import type { Cmp, Circle, Rect, Color } from './type';
import { defaultCmp, toRect, getColor, getPoints, isRect } from './share';

export const rectDetect = (
  pixels: ArrayLike<number>,
  width: number,
  height: number,
  option?: Partial<{
    channel: number;
    color: Color;
    cmp: Cmp;
    eps: number;
  }>
): Rect[] => {
  const _option = {
    color: [0, 0, 0, 0],
    channel: 4,
    cmp: defaultCmp,
    eps: 0.1,
  };
  const { channel, color, cmp, eps } = { ..._option, ...option };
  const rectList: Rect[] = [];
  const seen: Record<number, boolean> = {};
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (
        !seen[x + (y << 15)] &&
        cmp(color, getColor(pixels, x, y, width, channel))
      ) {
        const pos = getPoints(
          pixels,
          x,
          y,
          color,
          width,
          height,
          channel,
          seen,
          cmp
        );
        if (isRect(pos, eps)) {
          rectList.push(toRect(pos));
        }
      } else {
        seen[x + (y << 15)] = true;
      }
    }
  }
  return rectList;
};

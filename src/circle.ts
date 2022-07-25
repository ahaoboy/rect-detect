import type { Cmp, Circle, Color, Seen } from './type';
import { defaultCmp, getPoints, getColor, toCircle, isCircle } from './share';

export const circleDetect = (
  pixels: ArrayLike<number>,
  width: number,
  height: number,
  option?: Partial<{
    channel: number;
    color: Color;
    cmp: Cmp;
  }>
): Circle[] => {
  const _option = {
    color: [0, 0, 0, 0],
    channel: 4,
    cmp: defaultCmp,
    eps: 0.1,
  };
  const { channel, color, cmp, eps } = { ..._option, ...option };
  const circleList: Circle[] = [];
  const seen: Seen = {};
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
        if (isCircle(pos, eps)) {
          circleList.push(toCircle(pos));
        }
      } else {
        seen[x + (y << 15)] = true;
      }
    }
  }
  return circleList;
};

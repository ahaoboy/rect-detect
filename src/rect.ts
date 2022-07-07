import { Cmp, Point, Rect, Color } from "./type";
import { defaultCmp } from "./share";
const toRect = (pos: Point[]): Rect => {
  let lt = pos[0];
  let rt = pos[0];
  let lb = pos[0];
  let rb = pos[0];
  for (const p of pos) {
    if (p[0] <= lt[0] && p[1] <= lt[1]) {
      lt = p;
    }

    if (p[0] >= rb[0] && p[1] >= rb[1]) {
      rb = p;
    }

    if (p[0] >= rt[0] && p[1] <= rt[1]) {
      rt = p;
    }

    if (p[0] <= lb[0] && p[1] >= lb[1]) {
      lb = p;
    }
  }
  return [lt[0], lt[1], rt[0] - lt[0] + 1, lb[1] - lt[1] + 1];
};
export const rectDetect = (
  pixels: ArrayLike<number>,
  width: number,
  height: number,
  option?: Partial<{
    channel: number;
    color: Color;
    cmp: Cmp;
  }>
): Rect[] => {
  const _option = {
    color: [0, 0, 0, 0],
    channel: 4,
    cmp: defaultCmp,
  };
  const { channel, color, cmp } = { ..._option, ...option };
  const rectList: Rect[] = [];
  const seen: Record<number, boolean> = {};
  const direction: Point[] = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];

  const getColor = (x: number, y: number): Color => {
    const i = (x + y * width) * channel;
    return Array(channel)
      .fill(0)
      .map((_, k) => {
        return pixels[i + k];
      });
  };
  const bfs = (x: number, y: number): Point[] => {
    const pos: Point[] = [[x, y]];
    const q: Point[] = [[x, y]];
    seen[x + (y << 15)] = true;
    while (q.length) {
      const [x, y] = q.shift()!;
      for (let [dx, dy] of direction) {
        const _x = x + dx;
        const _y = y + dy;
        if (
          _x >= 0 &&
          _y >= 0 &&
          _x < width &&
          _y < height &&
          !seen[_x + (_y << 15)] &&
          cmp(color, getColor(x, y))
        ) {
          seen[_x + (_y << 15)] = true;
          q.push([_x, _y]);
          pos.push([_x, _y]);
        }
      }
    }
    return pos;
  };
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (!seen[x + (y << 15)] && cmp(color, getColor(x, y))) {
        const pos = bfs(x, y);
        rectList.push(toRect(pos));
      } else {
        seen[x + (y << 15)] = true;
      }
    }
  }
  return rectList;
};

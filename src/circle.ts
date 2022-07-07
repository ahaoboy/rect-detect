import { Cmp, Point, Circle, Color } from "./type";
import { defaultCmp } from "./share";

const toCircle = (pos: Point[]): Circle => {
  let ltx = pos[0][0];
  let lty = pos[0][1];
  let rbx = pos[0][0];
  let rby = pos[0][1];

  for (const p of pos) {
    ltx = Math.min(ltx, p[0]);
    lty = Math.min(lty, p[1]);
    rbx = Math.max(rbx, p[0]);
    rby = Math.max(rby, p[1]);
  }
  const w = rbx - ltx;
  const x = ltx + Math.round(w / 2);
  const h = rby - lty;
  const y = lty + Math.round(h / 2);
  const r = Math.round((w + h) / 4);
  return [x, y, r];
};
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
  };
  const { channel, color, cmp } = { ..._option, ...option };
  const rectList: Circle[] = [];
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
        rectList.push(toCircle(pos));
      } else {
        seen[x + (y << 15)] = true;
      }
    }
  }
  return rectList;
};

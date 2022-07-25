import type { Cmp, Point, Color, Pixels, Seen, Rect, Circle } from './type';

export const defaultCmp: Cmp = (color1, color2) => {
  const size = Math.min(color1.length, color2.length);
  let len = 0;
  for (let i = 0; i < size; i++) {
    len += (color1[i] - color2[i]) ** 2;
  }
  return Math.sqrt(len) < 32;
};
export const getColor = (
  pixels: Pixels,
  x: number,
  y: number,
  width: number,
  channel: number
): Color => {
  const i = (x + y * width) * channel;
  return Array(channel)
    .fill(0)
    .map((_, k) => {
      return pixels[i + k];
    });
};

export const getPoints = (
  pixels: Pixels,
  x: number,
  y: number,
  color: number[],
  width: number,
  height: number,
  channel: number,
  seen: Seen = {},
  cmp: Cmp = defaultCmp
) => {
  const direction: Point[] = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];

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
          cmp(color, getColor(pixels, x, y, width, channel))
        ) {
          seen[_x + (_y << 15)] = true;
          q.push([_x, _y]);
          pos.push([_x, _y]);
        }
      }
    }
    return pos;
  };

  return bfs(x, y);
};

export const toRect = (pos: Point[]): Rect => {
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

export const toCircle = (pos: Point[]): Circle => {
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

export const equal = (a: number, b: number, eps = 0.1) => {
  const d = Math.abs(a - b) / Math.min(a, b);
  return d <= eps;
};

export const isCircle = (pos: Point[], eps: number = 0.1): boolean => {
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
  const h = rby - lty;
  const r = Math.round((w + h) / 4);
  const area = Math.PI * r * r;
  return (
    equal(pos.length, area, eps) && equal(r * 2, w, eps) && equal(r * 2, h, eps)
  );
};

export const isRect = (pos: Point[], eps = 0.01): boolean => {
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
  const h = rby - lty;
  return equal(pos.length, w * h, eps);
};

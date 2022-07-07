export type Color = number[];
export type Cmp = (color1: Color, color2: Color) => boolean;
export type Point = [number, number];
export type Rect = [x: number, y: number, w: number, h: number];
export type Circle = [x: number, y: number, r: number]
export type Pixels = ArrayLike<number>
export type Seen = Record<number, boolean>

const defaultCmp: Cmp = (color1, color2) => {
  const size = Math.min(color1.length, color2.length);
  let len = 0;
  for (let i = 0; i < size; i++) {
    len += (color1[i] - color2[i]) ** 2;
  }
  return Math.sqrt(len) < 25;
};

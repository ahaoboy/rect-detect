import { Cmp } from "./type";

export const defaultCmp: Cmp = (color1, color2) => {
  const size = Math.min(color1.length, color2.length);
  let len = 0;
  for (let i = 0; i < size; i++) {
    len += (color1[i] - color2[i]) ** 2;
  }
  return Math.sqrt(len) < 25;
};

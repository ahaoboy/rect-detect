import { useEffect, useRef } from "react";
import { rectDetect, circleDetect } from "../../src/index";
const randomInt = (n: number, m: number) => {
  return ((Math.random() * (m - n)) | 0) + n;
};
const checkLine = (aMin: number, aMax: number, bMin: number, bMax: number) => {
  if (aMax < bMin) return false;
  if (aMin > bMax) return false;
  return true;
};

const isHit = (box1: number[], box2: number[]) => {
  return (
    checkLine(box1[0], box1[0] + box1[2], box2[0], box2[0] + box2[2]) &&
    checkLine(box1[1], box1[1] + box1[3], box2[1], box2[1] + box2[3])
  );
};

const R = "rgba(255,0,0,255)";
const G = "rgba(0,255,0,255)";
const B = "rgba(0,0,255,255)";
const W = "rgba(255,255,255,255)";
const GRAY = "rgba(233,233,233,255)";
const BLACK = "rgba(0,0,0,255)";
function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const randomInit = () => {
    const width = 600;
    const height = 800;

    const count = 50;
    // const rect = [
    //   [30, 60, 100, 120],
    //   [200, 300, 150, 100],
    //   [400, 400, 50, 30],
    //   [240, 100, 200, 100],
    // ];
    const rect: number[][] = [];
    const circle: number[][] = [];
    const hitList: number[][] = [];
    for (let i = 0; i < count; i++) {
      const x = randomInt(0, width);
      const y = randomInt(0, height);
      const w = randomInt(20, width / 4);
      const h = randomInt(20, height / 4);

      if (x + w >= width || y + h >= height) {
        continue;
      }
      let hit = false;
      for (const r of hitList) {
        if (isHit([x, y, w, h], r)) {
          hit = true;
          break;
        }
      }
      if (!hit) {
        if (Math.random() < 0.4) {
          const r = Math.min(w, h) >> 1;
          const _x = (x + r) | 0
          const _y = (y +r)  |0
          circle.push([_x, _y, r]);
          hitList.push([x, y, w,h]);
        } else {
          rect.push([x, y, w, h]);
          hitList.push([x, y, w,h]);
        }
      }
    }
    const canvas = canvasRef.current!;
    canvas.width = width;
    canvas.height = height;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    const ctx = canvas.getContext("2d")!;
    // bg
    ctx.fillStyle = GRAY;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = BLACK;

    for (const [x, y, w, h] of rect) {
      ctx.fillRect(x, y, w, h);
    }

    for (const [x, y, r] of circle) {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, 2 * Math.PI, false);
      ctx.fillStyle = B;
      ctx.fill();
    }
    return canvas;
  };
  const detect = () => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const { width, height } = canvas;
    const pixel = ctx.getImageData(0, 0, width, height).data;

    // detect
    const rect = rectDetect(pixel, width, height, {
      color: [0, 0, 0, 255],
    });
    ctx.fillStyle = R;

    for (const [x, y, w, h] of rect) {
      ctx.beginPath();
      ctx.rect(x, y, w, h);
      ctx.strokeStyle = R;
      ctx.stroke();
    }
    console.log("rect", rect);

    const circle = circleDetect(pixel, width, height, {
      color: [0, 0, 255, 255],
    });

    for (const [x, y, r] of circle) {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, 2 * Math.PI, false);
      ctx.lineWidth = 1;
      ctx.strokeStyle = R;
      ctx.stroke();
    }
    console.log("circle", circle);
  };

  useEffect(() => {
    randomInit();
  }, []);

  return (
    <div>
      <div>
        <button onClick={randomInit}>random</button>
        <button onClick={detect}>detect</button>
      </div>
      <canvas id="canvas" ref={canvasRef}></canvas>
    </div>
  );
}

export default App;

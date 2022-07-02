import { useEffect, useRef } from "react";
import { rectDetect } from "../../src/index";
const randomInt = (n: number, m: number) => {
  return ((Math.random() * (m - n)) | 0) + n;
};
const checkLine = (aMin:number, aMax:number, bMin:number, bMax:number) => {
  if (aMax < bMin) return false
  if (aMin > bMax) return false
  return true
}

const isHit = (box1:number[], box2:number[]) => {
  return (
    checkLine(box1[0], box1[0] + box1[2], box2[0], box2[0] + box2[2]) &&
    checkLine(box1[1], box1[1] + box1[3], box2[1], box2[1] + box2[3])
  )
}

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
    for (let i = 0; i < count; i++) {
      const x = randomInt(0, width);
      const y = randomInt(0, height);
      const w = randomInt(10, width / 4);
      const h = randomInt(10, height / 4);

      if (x + w >= width || y + h >= height) {
        continue;
      }

      let hit = false;
      for (const r of rect) {
        if (isHit([x, y, w, h], r)) {
          hit = true;
          break;
        }
      }

      if (!hit) rect.push([x, y, w, h]);
    }
    const canvas = canvasRef.current!;
    canvas.width = width;
    canvas.height = height;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    const ctx = canvas.getContext("2d")!;
    // bg
    ctx.fillStyle = "green";
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "black";

    for (const [x, y, w, h] of rect) {
      ctx.fillRect(x, y, w, h);
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
    ctx.fillStyle = "red";

    for (const [x, y, w, h] of rect) {
      ctx.beginPath();
      ctx.rect(x, y, w, h);
      ctx.strokeStyle = "red";
      ctx.stroke();
    }
    console.log("rect", rect);
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

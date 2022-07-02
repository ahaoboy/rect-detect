```
npm i rect-detect
```


```
import { rectDetect } from "rect-detect";

const rect = rectDetect(pixel, width, height, {
    color: [0, 0, 0, 255],
}).map(([lt, rt, lb, rb]) => {
    return [lt[0], lt[1], rt[0] - lt[0] + 1, lb[1] - lt[1] + 1];
});

ctx.fillStyle = "red";

for (const [x, y, w, h] of rect) {
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.strokeStyle = "red";
    ctx.stroke();
}

```
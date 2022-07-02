[demo](https://rect-detect.vercel.app/)

```
npm i rect-detect
```


```
import { rectDetect } from "rect-detect";

const rect = rectDetect(pixel, width, height, {
    color: [0, 0, 0, 255],
}) 

ctx.fillStyle = "red";

for (const [x, y, w, h] of rect) {
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.strokeStyle = "red";
    ctx.stroke();
}
```
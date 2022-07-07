[demo](https://rect-detect.vercel.app/)

```
npm i rect-detect
```


```
import { rectDetect, circleDetect } from "rect-detect";

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
```
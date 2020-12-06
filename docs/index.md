---
title: DEMO
---

# 签名

## 横屏

```tsx
import React, { useEffect, useState } from 'react';
import Signature from 'signature-canvas';
import { TestData } from '../test/data/index';

const App: React.FC = () => {
  const [canvas, setCanvas] = useState();
  useEffect(() => {
    const signature = new Signature({
      container: 'canvas',
      width: 667,
      height: 375,
      backgroundColor: '#f5f5f5',
      onEnd: () => {
        console.log('end');
      }
    });
    setCanvas(signature);
  }, []);

  // undo
  const unDo = () => {
    canvas.undo();
  };

  // clear
  const clear = () => {
    canvas.clear();
  };

  // toDataURL
  const toData = () => {
    const data = canvas.toDataURL();
    let a = document.createElement('a');
    a.href = data;
    a.download = '签名.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    a = null;
  };

  // reset
  const reset = () => {
    canvas.initData(TestData);
  };

  return (
    <>
      <canvas id="canvas" />
      <div>
        <button onClick={unDo} style={{ marginRight: 24 }}>
          撤销
        </button>
        <button onClick={clear} style={{ marginRight: 24 }}>
          清除
        </button>
        <button onClick={toData} style={{ marginRight: 24 }}>
          下载
        </button>
        <button onClick={reset}>重置数据</button>
      </div>
    </>
  );
};
export default App;
```

## 竖屏

```tsx
import React, { useEffect, useState } from 'react';
import Signature from 'signature-canvas';

const App: React.FC = () => {
  const [canvas, setCanvas] = useState();

  useEffect(() => {
    const signature = new Signature({
      container: 'canvas-1',
      width: 667,
      height: 375,
      rotate: 90,
      backgroundColor: '#f5f5f5',
      onEnd: () => {
        console.log('end');
      }
    });
    setCanvas(signature);
  }, []);

  // undo
  const unDo = () => {
    canvas.undo();
  };

  // clear
  const clear = () => {
    canvas.clear();
  };

  // toDataURL
  const toData = () => {
    const data = canvas.toDataURL();
    let a = document.createElement('a');
    a.href = data;
    a.download = '签名.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    a = null;
  };
  const width = 667;
  const height = 420;
  const style = {
    width,
    height,
    transform: `rotate(90deg) translate(${(width - height) / 2}px, ${(width - height) / 2}px)`,
  };
  return (
    <div style={{ width: 700, height: 700 }}>
      <div style={style}>
        <canvas id="canvas-1" />
        <div>
          <button onClick={unDo} style={{ marginRight: 24 }}>
            撤销
          </button>
          <button onClick={clear} style={{ marginRight: 24 }}>
            清除
          </button>
          <button onClick={toData}>下载</button>
        </div>
      </div>
    </div>
  );
};
export default App;
```

## API

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| container | 画布 id 或画布实例 | string \|  HTMLCanvasElement | - |
| width | 画布宽度 | number | 400 |
| height | 画布高度 | number | 200 |
| penColor | 画笔颜色 | string | blank |
| backgroundColor | 画布背景色 | string | #fff |
| rotate | 画布旋转角度，支持[0,90,-90,180,-180] | number | 0 |
| minWidth | 画笔最小值 | number | 1 |
| maxWidth | 画笔最大值 | number | 4 |
| deafultWidth | 画布起始值(每次触碰画布时的大小)，建议不小于最小值，且不大于最大值。 | number | 3 |
| backgroundImage | 画布背景设置 | backgroundImage | - |
| onBegin | 开始绘制函数，多次触发 | (e: MouseEvent \| Touch)=>void | - |
| onEnd | 绘制结束函数，多次触发 | (e: MouseEvent \|  Touch)=>void | - |
| clear | 清除画布 | () => void | - |
| undo | 撤销 | () => void | - |
| toDataURL | 获取画布数据，Base64 | (type = 'image/png', encoderOptions?: number) => string | - |
| getHistory | 获取画布栈数据 | () => string[] | - |
| isEmpty | 判断画布是否为空 | () => boolean | - |
| initData | 初始化画布数据，Base64 | (string) => void | - |
| offEvent | 取消画布的监听事件 | () => void | - |

### <br />

### backgroundImage

| 属性 | 说明                     | 类型   | 默认值 |
| ---- | ------------------------ | ------ | ------ |
| src  | 背景图片地址             | string | -      |
| x    | 背景图距离画布左侧的距离 | number | 0      |
| y    | 背景图距离画布上侧的距离 | number | 0      |

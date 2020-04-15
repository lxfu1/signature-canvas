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
      minWidth: 1,
      maxWidth: 4,
      deafultWidth: 3,
      backgroundColor: '#f5f5f5',
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
      minWidth: 1,
      maxWidth: 4,
      deafultWidth: 3,
      backgroundColor: '#f5f5f5',
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

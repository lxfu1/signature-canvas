# signature-canvas: 签名插件

[Demo](https://lxfu.github.io/signature-canvas/)

<img src='https://gw.alipayobjects.com/mdn/rms_7bc6d8/afts/img/A*p8T6RL60fSAAAAAAAAAAAABkARQnAQ' width=667 />

## 特性

- 开箱即用

- TypeScript

- 支持横屏竖屏

## 安装

```bash
$ npm install signature-canvas
```

## 使用

### 横屏

```js
import Signature from 'signature-canvas';

const signature = new Signature({
  container: 'canvas',
  width: 667,
  height: 375,
});

// 撤销
const unDo = () => {
  signature.undo();
};

// 清除
const clear = () => {
  signature.clear();
};

// 下载
const toData = () => {
  const data = signature.toDataURL();
  console.log(data);
};

<canvas id="canvas" />;
```

### 竖屏

```js
import Signature from 'signature-canvas';

const signature = new Signature({
  container: 'canvas',
  width: 667,
  height: 375,
  rotate: 90,
});

const width = 667;
const height = 420;
const style = {
  width,
  height,
  transform: `rotate(90deg) translate(${(width - height) / 2}px, ${(width - height) / 2}px)`,
};
<div style={style}>
  <canvas id="canvas" />
</div>;
```

## API

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| container | 画布 id 获画布实例 | string \|  HTMLCanvasElement | - |
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

## 开发

```bash
$ npm install

# build watching file changes and run demos
$ npm run dev
```

## License

[MIT license](./LICENSE).

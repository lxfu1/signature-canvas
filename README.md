# signature-canvas: A signature canvas in TypeScript.

## Features

- Easy to use
- TypeScript
- Supported H5 and PC
- Supported horizontal and vertival layout

## Installation

```bash
$ npm install signature-canvas
```

## Usage

```js
import Signature from "@/components/Signature/index";

const signature = new Signature("canvas", {
  width: 600,
  height: 400,
  direction: "horizontal",
  minWidth: 1,
  maxWidth: 4,
  deafultWidth: 3,
  backgroundColor: "#f5f5f5",
  backgroundImage: {
    src:
      "https://gw.alipayobjects.com/mdn/rms_dccb5f/afts/img/A*l2VvSJXWdigAAAAAAAAAAABkARQnAQ",
    x: 10,
    y: 10
  }
});

// undo
const unDo = () => {
  signature.undo();
};

// clear
const clear = () => {
  signature.clear();
};

// toDataURL
const toData = () => {
  const data = signature.toDataURL();
  console.log(data);
};
```

## Development

```bash
$ npm install

# build watching file changes and run demos
$ npm run dev
```

## Props

The props of SignatureCanvas mainly control the properties of the pen stroke used in drawing. All props are optional.

- container: container id;
- width: canvas width, default 400;
- height: canvas height, default 200;
- penColor: pen color, default blank;
- direction: canvas direction('horizontal | vertical'), default horizontal;
- deafultWidth: default size when the brush touches the canvas, default 3;
- minWidth: brush minimum, default 1;
- maxWidth: brush maxmum, defauult 4;
- backgroundColor: canvas background color, default '#fff';
- backgroundImage: canvas background image;
- src: image address;
- x: image X coordinate, default 0;
- y: image Y coordinate, default 0;
- onBegin: Function at start of drawing;
- onEnd: Function at end of drawing;

## API

- clear: void, clears the canvas using the backgroundColor and backgroundImage;
- undo: void, cancel the previous operation;
- toDataURL: get canvas DataURL;
- offEvent: unbind events;

## License

[MIT license](./LICENSE).

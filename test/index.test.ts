import Signature from '../src';
import { TestData } from '../test/data/index';

let canvas: HTMLCanvasElement;

beforeAll(() => {
  canvas = document.createElement('canvas');
  canvas.width = 667;
  canvas.height = 375;
});

// TODO: constructor
describe('#constructor', () => {
  it('测试默认值', () => {
    const signature = new Signature({
      container: canvas,
    });
    expect(signature.minWidth).toBe(1);
  });

  it('测试props', () => {
    const signature = new Signature({
      container: canvas,
      maxWidth: 5,
    });
    expect(signature.maxWidth).toBe(5);
  });
});

// TODO: clear
describe('#clear', () => {
  it('clear data', () => {
    const signature = new Signature({
      container: canvas,
    });
    signature.initData(TestData);
    expect(signature.isEmpty()).toBe(false);
    signature.clear();
    expect(signature.isEmpty()).toBe(true);
  });
});

// TODO: initData
describe('#initData', () => {
  const mockFunc = () => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, 300);
    });
  };
  it('init data', async () => {
    const signature = new Signature({
      container: canvas,
    });
    signature.initData(TestData);
    await mockFunc();
    expect(signature.getHistory()[0]).toBe(TestData);
  });
});

import { throttle } from "./throttle";

interface IBackgroundImage {
  src: string;
  x: number;
  y: number;
}

interface IConfig {
  container: string | HTMLCanvasElement; // 容器ID
  width?: number; // 画布宽度
  height?: number; // 画布高度
  penColor?: string; // 画笔颜色
  deafultWidth?: number; // 画笔起始大小
  minWidth?: number; // 画笔最小值
  maxWidth?: number; // 画笔最大值
  backgroundColor?: string; // 画布背景色
  backgroundImage?: IBackgroundImage; // 背景图片
  onBegin?: (e: MouseEvent | Touch) => void; // 开始绘制
  onEnd?: (e: MouseEvent | TouchEvent) => void; // 绘制结束
  rotate?: number; // 画布旋转角度
}

class Signature {
  width: number;

  height: number;

  penColor: string;

  rotate: number;

  backgroundColor: string;

  backgroundImage?: IBackgroundImage;

  deafultWidth: number;

  minWidth: number;

  maxWidth: number;

  onBegin?: (e: MouseEvent | Touch) => void;

  onEnd?: (e: MouseEvent | TouchEvent) => void;

  private throttleTime = 16; // 防抖时间

  private minDistance = 6; // 用户throttleTime划过最小距离，小于该距离可以判断用户有停留，画笔逐渐增多，反之亦然。

  private maxDistance = 500; // 用户throttleTime划过最大距离

  private reduceFactor: number;

  private addFactor: number;

  private currentLineWidth = 0;

  private canvas: HTMLCanvasElement;

  private context: CanvasRenderingContext2D;

  private isMouseDown = false;

  private lastLocation = { x: 0, y: 0 }; // 上一次鼠标的位置

  private canvasHistory: string[] = []; // 历史栈

  constructor(config: IConfig) {
    if (!config || !config?.container) {
      throw new Error("初始化DOM树失败，请确保元素ID或DOM实例存在");
    }
    this.width = config.width || 400;
    this.height = config.height || 200;
    this.penColor = config.penColor || "blank";
    this.rotate = config.rotate || 0;
    this.backgroundColor = config.backgroundColor || "#fff";
    this.backgroundImage = config.backgroundImage;
    this.deafultWidth = config.deafultWidth || 3;
    this.minWidth = config.minWidth || 1;
    this.maxWidth = config.maxWidth || 4;
    this.onBegin = config.onBegin;
    this.onEnd = config.onEnd;
    this.currentLineWidth =
      config.deafultWidth || (this.maxWidth + this.minWidth) / 2;
    this.canvas =
      typeof config.container === "string"
        ? (document.getElementById(config.container) as HTMLCanvasElement)
        : config.container;
    this.context = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    /**
     * 递减速率不高于1
     * (max - min ) * maxDistance * base <= 1, maxDistance为16ms内用户划过的距离上限，可以调整。
     */
    this.reduceFactor =
      1 / (this.maxDistance * (this.maxWidth - this.minWidth));
    /**
     * 递增速率不高于0.1
     * (max - min ) * minDistance * base <= 0.1, minDistance为16ms内用户划过的最小距离，可以调整。
     */
    this.addFactor =
      1 / (10 * (this.maxWidth - this.minWidth) * this.minDistance);

    this.initCanvas();
    this.onEvent();
  }

  private getWidth = () => this.width;

  private getHeight = () => this.height;

  // 初始化画笔大小
  private initLineWidth = () => {
    const { deafultWidth, maxWidth, minWidth } = this;
    this.currentLineWidth = deafultWidth || (maxWidth + minWidth) / 2;
  };

  // 屏幕坐标与canvas坐标的转换
  private windowToCanvas = (x: number, y: number) => {
    const { canvas, width, height, rotate } = this;
    const bbox = canvas.getBoundingClientRect();
    let dx = x - bbox.left;
    let dy = y - bbox.top;
    const swap = dx;
    switch (rotate) {
      case -90:
        dx = width - dy;
        dy = swap;
        break;
      case 90:
        dx = dy;
        dy = height - swap;
        break;
      case -180:
      case 180:
        dx = width - dx;
        dy = height - dy;
        break;
      default:
        /* eslint-disable */
        console.warn("不支持等rotate，仅支持[90, -90, 180, -180]");
    }
    return { x: Math.round(dx), y: Math.round(dy) };
  };

  /**
   * 获取当前针画笔大小
   * @param {endX} number 结束点X坐标
   * @param {endY} number 结束点Y坐标
   */
  private getLineWidth = (endX: number, endY: number) => {
    const {
      lastLocation,
      minDistance,
      currentLineWidth,
      maxWidth,
      addFactor,
      minWidth,
      reduceFactor
    } = this;
    const absX = endX - lastLocation.x;
    const absY = endY - lastLocation.y;
    const d = Math.sqrt(absX * absX + absY * absY);
    let lineWidth = currentLineWidth;
    if (d < minDistance) {
      lineWidth +=
        (maxWidth - currentLineWidth) * (minDistance - d) * addFactor;
      lineWidth = Math.min(maxWidth, lineWidth);
    }
    if (d > minDistance) {
      lineWidth -= (currentLineWidth - minWidth) * d * reduceFactor;
      lineWidth = Math.max(lineWidth, minWidth);
    }
    this.currentLineWidth = lineWidth;
    return lineWidth;
  };

  /**
   * 绘制函数
   * @param {e} MouseEvent | Touch 鼠标、触碰对象
   */
  private updateStroke = (e: MouseEvent | Touch) => {
    const {
      context,
      penColor,
      windowToCanvas,
      lastLocation,
      getLineWidth
    } = this;
    const curLoc = windowToCanvas(e.clientX, e.clientY);
    context.beginPath();
    context.strokeStyle = penColor;
    context.lineWidth = getLineWidth(curLoc.x, curLoc.y);
    context.lineCap = "round";
    context.lineJoin = "round";
    context.moveTo(lastLocation.x, lastLocation.y);
    context.lineTo(curLoc.x, curLoc.y);
    context.stroke();
    this.lastLocation = curLoc;
  };

  private throttleFn = throttle(this.updateStroke, this.throttleTime);

  private startStroke = (e: MouseEvent | Touch) => {
    const { onBegin } = this;
    if (typeof onBegin === "function") {
      onBegin(e);
    }

    this.throttleFn(e);
  };

  private resetStatus = (e: TouchEvent | MouseEvent) => {
    e.preventDefault();
    if (this.isMouseDown) {
      const { canvas } = this;
      this.canvasHistory.push(canvas.toDataURL());
      if (typeof this.onEnd === "function") {
        this.onEnd(e);
      }
    }
    this.isMouseDown = false;
    this.initLineWidth();
  };

  //  pc、pointer鼠标按下
  private handleMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    this.isMouseDown = true;
    this.lastLocation = this.windowToCanvas(e.clientX, e.clientY);
  };

  //  pc、pointer鼠标移动
  private handleMouseMove = (e: MouseEvent) => {
    e.preventDefault();
    if (this.isMouseDown) {
      this.startStroke(e);
    }
  };

  //  pc、pointer鼠标松开
  private handleMouseUp = (e: MouseEvent) => {
    this.resetStatus(e);
  };

  //  pc、pointer鼠标划出画布
  private handleMouseOut = (e: MouseEvent) => {
    this.resetStatus(e);
  };

  private handleTouchStart = (e: TouchEvent) => {
    e.preventDefault();
    this.isMouseDown = true;
    if (e.targetTouches.length === 1) {
      const touch = e.changedTouches[0];
      this.lastLocation = this.windowToCanvas(touch.clientX, touch.clientY);
      this.startStroke(touch);
    }
  };

  private handleTouchMove = (e: TouchEvent) => {
    e.preventDefault();
    const touch = e.targetTouches[0];
    this.startStroke(touch);
  };

  private handleTouchEnd = (e: TouchEvent) => {
    this.resetStatus(e);
  };

  // h5
  private initTouchEvent = () => {
    const { canvas } = this;
    canvas.addEventListener("touchstart", this.handleTouchStart);
    canvas.addEventListener("touchmove", this.handleTouchMove);
    canvas.addEventListener("touchend", this.handleTouchEnd);
  };

  // pc
  private initMouseEvent = () => {
    const { canvas } = this;
    canvas.addEventListener("mousedown", this.handleMouseDown);
    canvas.addEventListener("mousemove", this.handleMouseMove);
    canvas.addEventListener("mouseout", this.handleMouseOut);
    document.addEventListener("mouseup", this.handleMouseUp);
  };

  // 触笔
  private initPointerEvent = () => {
    const { canvas } = this;
    canvas.addEventListener("pointerdown", this.handleMouseDown);
    canvas.addEventListener("pointermove", this.handleMouseMove);
    canvas.addEventListener("pointerout", this.handleMouseOut);
    document.addEventListener("pointerup", this.handleMouseUp);
  };

  //  事件绑定
  onEvent = () => {
    const { canvas } = this;
    canvas.style.touchAction = "none";
    canvas.style.msTouchAction = "none";
    if (window.PointerEvent) {
      this.initPointerEvent();
    } else {
      this.initMouseEvent();

      if ("ontouchstart" in window) {
        this.initTouchEvent();
      }
    }
  };

  // 绘制背景
  private drawBackground = () => {
    const {
      context,
      getWidth,
      getHeight,
      backgroundColor,
      backgroundImage
    } = this;
    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, getWidth(), getHeight());
    if (backgroundImage?.src) {
      const img = new Image();
      img.setAttribute("crossOrigin", "anonymous");
      img.src = backgroundImage?.src;
      img.onload = () => {
        context.drawImage(
          img,
          backgroundImage?.x || 0,
          backgroundImage?.y || 0
        );
      };
    }
  };

  // 画布
  private initCanvas = () => {
    const { context, drawBackground, width, height, canvas } = this;
    const { devicePixelRatio } = window;
    if (devicePixelRatio) {
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      canvas.width = width * devicePixelRatio;
      canvas.height = height * devicePixelRatio;
      context.scale(devicePixelRatio, devicePixelRatio);
    } else {
      canvas.width = width;
      canvas.height = height;
    }
    drawBackground();
  };

  /* 图片下载 */
  toDataURL(type = "image/png", encoderOptions?: number) {
    return this.canvas.toDataURL(type, encoderOptions);
  }

  /* 清除 */
  clear = (clearHistory = true) => {
    const { context, getWidth, getHeight, drawBackground } = this;
    context.clearRect(0, 0, getWidth(), getHeight());

    if (!clearHistory && this.canvasHistory.length) {
      return;
    }
    this.canvasHistory = [];
    drawBackground();
  };

  /* 撤销重做 */
  undo = () => {
    const {
      canvasHistory,
      context,
      getWidth,
      getHeight,
      drawBackground,
      clear,
      width,
      height
    } = this;
    if (!canvasHistory.length) {
      return;
    }
    canvasHistory.pop();
    if (canvasHistory.length === 0) {
      context.clearRect(0, 0, getWidth(), getHeight());
      drawBackground();
    } else {
      const img = new Image();
      img.src = canvasHistory[canvasHistory.length - 1];
      img.onload = () => {
        clear(false);
        context.drawImage(img, 0, 0, width, height);
      };
    }
  };

  /* 取消事件绑定 */
  offEvents = () => {
    const { canvas } = this;
    // Enable panning/zooming when touching canvas element
    canvas.style.touchAction = "auto";
    canvas.style.msTouchAction = "auto";

    canvas.removeEventListener("touchstart", this.handleTouchStart);
    canvas.removeEventListener("touchmove", this.handleTouchMove);
    canvas.removeEventListener("touchend", this.handleTouchEnd);

    canvas.removeEventListener("mousedown", this.handleMouseDown);
    canvas.removeEventListener("mousemove", this.handleMouseMove);
    canvas.removeEventListener("mouseout", this.handleMouseOut);
    document.removeEventListener("mouseup", this.handleMouseUp);

    canvas.removeEventListener("pointerdown", this.handleMouseDown);
    canvas.removeEventListener("pointermove", this.handleMouseMove);
    canvas.removeEventListener("pointerout", this.handleMouseOut);
    document.removeEventListener("pointerup", this.handleMouseUp);
  };
}

export default Signature;

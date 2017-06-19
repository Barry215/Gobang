import {GraphicsModelModule} from "./GraphicsModelModule";
/**
 * @module GraphicsModule
 * @description 显卡模块
 */
export module GraphicsModule {
  import Circle = GraphicsModelModule.Circle;
  import Arrow = GraphicsModelModule.Arrow;
  import OneKey = GraphicsModelModule.OneKey;
  import TextBox = GraphicsModelModule.TextBox;
  import StraightLine = GraphicsModelModule.StraightLine;
  import Coordinate = GraphicsModelModule.Coordinate;
  export interface Graphics {
    /**
     * @method clearGraphics
     * @description 清空画板
     */
    clearGraphics();
    /**
     * @method drawCircle
     * @description 画一个圆形
     * @param element {Circle}
     */
    drawCircle(element: Circle);
    /**
     * @method drawArrow
     * @description 画一个箭头
     * @param element {Arrow}
     */
    drawArrow(element: Arrow);
    /**
     * @method drawOneKey
     * @description 画一个字符
     * @param element {OneKey}
     */
    drawOneKey(element: OneKey);
    /**
     * @method drawText
     * @description 画一个文本框
     * @param element {TextBox}
     */
    drawText(element: TextBox);
    /**
     * @method getMouseLocation
     * @description 获得画板内的鼠标点击坐标
     * @param e {MouseEvent}
     */
    getMouseLocation(e: MouseEvent);
    /**
     * @method drawStraightLine
     * @description 画一个直线
     * @param element {StraightLine}
     */
    drawStraightLine(element: StraightLine);
    /**
     * @method resize
     * @description 重设画板大小
     * @param height 高度
     * @param width 宽度
     */
    resize(height: number, width: number);
    /**
     * @method setDefault
     * @description 设置默认样式
     */
    setDefault();
  }
  /**
   * @class GraphicsCanvasImpl
   * @description Canvas显卡实现
   * @implements Graphics
   */
  export class GraphicsCanvasImpl implements Graphics {
    /**
     * @method setDefault
     * @description 设置默认样式
     */
    setDefault() {
      this.content2D.strokeStyle = '#000';
      this.content2D.fillStyle = '#fff';
      this.content2D.textAlign = 'center';
      this.content2D.textBaseline = 'middle';
    }

    /**
     * @method resize
     * @description 重设画板大小
     * @param height 高度
     * @param width 宽度
     */
    resize(height: number, width: number) {
      this.canvas.setAttribute('width', String(width));
      this.canvas.setAttribute('height', String(height))
    }

    /**
     * @method drawStraightLine
     * @description 画一个直线
     * @param element {StraightLine}
     */
    drawStraightLine(element: StraightLine) {
      this.setDefault();
      this.content2D.beginPath();
      this.content2D.moveTo(element.start.x, element.start.y);
      this.content2D.lineTo(element.end.x, element.end.y);
      this.content2D.strokeStyle = element.style;
      this.content2D.stroke();
      this.content2D.closePath();
    }

    /**
     * @method drawText
     * @description 画一个文本框
     * @param element {TextBox}
     */
    drawText(element: TextBox) {
      this.setDefault();
      this.content2D.beginPath();
      this.content2D.font = element.textFont;
      this.content2D.fillStyle = element.textStyle;
      this.content2D.textBaseline = element.textBaseline;
      this.content2D.textAlign = element.textAlign;
      this.content2D.fillText(element.text, element.coordinate.x, element.coordinate.y);
    }

    /**
     * @method drawOneKey
     * @description 画一个字符
     * @param element {OneKey}
     */
    drawOneKey(element: OneKey) {
      this.setDefault();
      this.content2D.beginPath();
      this.content2D.font = element.textFont;
      this.content2D.fillStyle = element.textStyle;
      this.content2D.textBaseline = element.textBaseline;
      this.content2D.textAlign = element.textAlign;
      this.content2D.fillText(element.key, element.coordinate.x, element.coordinate.y, element.keyMaxWidth);
    };

    /**
     * @method drawArrow
     * @description 画一个箭头
     * @param element {Arrow}
     */
    drawArrow(element: Arrow) {
      this.setDefault();
      this.content2D.translate(element.coordinate.x, element.coordinate.y);
      this.content2D.rotate(element.angle);
      this.content2D.beginPath();
      this.content2D.moveTo(0, 0);
      let x1, x2, x3, x4, y1, y2;
      x1 = -element.triangle_width / 2;
      x2 = -element.rectangle_width / 2;
      x3 = element.rectangle_width / 2;
      x4 = element.triangle_width / 2;
      y1 = element.triangle_height;
      y2 = element.triangle_height + element.rectangle_height;
      this.content2D.lineTo(x1, y1);
      this.content2D.lineTo(x2, y1);
      this.content2D.lineTo(x2, y2);
      this.content2D.lineTo(x3, y2);
      this.content2D.lineTo(x3, y1);
      this.content2D.lineTo(x4, y1);
      this.content2D.closePath();
      this.content2D.fillStyle = element.fillStyle;
      this.content2D.fill();
      this.content2D.rotate(-element.angle);
      this.content2D.translate(-element.coordinate.x, -element.coordinate.y);
    }

    /**
     * @method getMouseLocation
     * @description 获得画板内的鼠标点击坐标
     * @param e {MouseEvent}
     */
    getMouseLocation(e: MouseEvent) {
      let box = this.canvas.getBoundingClientRect();
      let x = e.clientX;
      let y = e.clientY;
      return new Coordinate(
        (x - box.left) * (this.canvas.width / box.width),
        (y - box.top) * (this.canvas.height / box.height)
      );
    }

    /**
     * @method clearGraphics
     * @description 清空画板
     */
    clearGraphics() {
      this.content2D.clearRect(0, 0,
        Number(this.canvas.getAttribute('width')),
        Number(this.canvas.getAttribute('height'))
      );
    }

    canvas: HTMLCanvasElement;
    content2D: CanvasRenderingContext2D;

    /**
     * @method drawCircle
     * @description 画一个圆形
     * @param element {Circle}
     */
    drawCircle(element: Circle) {
      this.setDefault();
      this.content2D.beginPath();
      this.content2D.arc(element.coordinate.x, element.coordinate.y, element.radius, 0, Math.PI * 2);
      this.content2D.strokeStyle =element.borderStyle;
      this.content2D.fillStyle = element.fillStyle;
      this.content2D.fill();
      this.content2D.stroke();
      this.content2D.font = element.textFont;
      this.content2D.fillStyle = element.textStyle;
      this.content2D.textBaseline = element.textBaseline;
      this.content2D.textAlign = element.textAlign;
      this.content2D.fillText(element.text, element.coordinate.x, element.coordinate.y, Math.sqrt(2) * element.radius);
      this.content2D.closePath();
    }

    /**
     * @constructor
     * @param canvas 二叉树画板
     */
    constructor(canvas: HTMLCanvasElement) {
      this.canvas = canvas;
      this.content2D = this.canvas.getContext('2d');
    }
  }
}

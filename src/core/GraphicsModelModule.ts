/**
 * @module GraphicsModelModule
 * @description 绘画板的基本数据模型
 */
export module GraphicsModelModule{
    /**
     * @class Arrow
     * @description 箭头
     */
    export class Arrow {
        /**
         * @property coordinate
         * @description 坐标
         * @type {Coordinate}
         */
        coordinate: Coordinate;
        /**
         * @property triangle_width
         * @description 三角形的底边宽
         * @type {number}
         */
        triangle_width: number = 10;
        /**
         * @property rectangle_width
         * @description 长方形的宽
         * @type {number}
         */
        rectangle_width: number = 6;
        /**
         * @property triangle_height
         * @description 三角形的高
         * @type {number}
         */
        triangle_height: number = 8;
        /**
         * @property rectangle_height
         * @description 长方形的高
         * @type {number}
         */
        rectangle_height: number = 5;
        /**
         * @property fillStyle
         * @description 填充颜色
         * @type {number}
         */
        fillStyle: string = '#000';
        /**
         * @property angle
         * @description 转动角度
         * @type {number}
         */
        angle: 0;

        /**
         * @constructor
         * @param coordinate 坐标
         * @param triangle_width 三角形的底边宽
         * @param rectangle_width 长方形的宽
         * @param triangle_height 三角形的高
         * @param rectangle_height 长方形的高
         * @param fillStyle 填充颜色
         * @param angle 转动角度
         */
        constructor(coordinate: Coordinate, triangle_width: number, rectangle_width: number, triangle_height: number, rectangle_height: number, fillStyle: string, angle: any) {
            this.coordinate = coordinate;
            this.triangle_width = triangle_width;
            this.rectangle_width = rectangle_width;
            this.triangle_height = triangle_height;
            this.rectangle_height = rectangle_height;
            this.fillStyle = fillStyle;
            this.angle = angle;
        }
    }
    /**
     * @class Circle
     * @description 圆形
     */
    export class Circle {
        /**
         * @property coordinate
         * @description 坐标
         * @type {Coordinate}
         */
        coordinate: Coordinate;
        /**
         * @property radius
         * @description 半径
         * @type {number}
         */
        radius: number;
        /**
         * @property fillStyle
         * @description 填充样式
         * @type {string}
         */
        fillStyle: string = '#FFF';
        /**
         * @property borderStyle
         * @description 边框样式
         * @type {string}
         */
        borderStyle: string = '#000';
        /**
         * @property text
         * @description 文本
         * @type {string}
         */
        text: string = '';
        /**
         * @property textStyle
         * @description 文本样式
         * @type {string}
         */
        textStyle: string = '#000';
        /**
         * @property textFont
         * @description 文本字体
         * @type {string}
         */
        textFont: string = '1em microsoft yahei';
        /**
         * @property textBaseline
         * @description 文本基线
         * @type {string}
         */
        textBaseline: string = 'middle';
        /**
         * @property textAlign
         * @description 文本对其方式
         * @type {string}
         */
        textAlign: string = 'center';

        /**
         * @constructor
         * @param coordinate 坐标
         * @param radius 半径
         * @param text 文本
         * @param fillStyle 填充颜色
         * @param borderStyle 边框颜色
         * @param textStyle 文本样式
         * @param textFont 文本字体
         */
        constructor(coordinate: Coordinate, radius: number, text?: string, fillStyle?: string, borderStyle?: string, textStyle?: string, textFont?: string) {
            this.coordinate = coordinate;
            this.radius = radius;
            if(fillStyle){
                this.fillStyle = fillStyle;
            }
            if(borderStyle){
                this.borderStyle = borderStyle;
            }
            if(text){
                this.text = text;
            }
            if(textStyle){
                this.textStyle = textStyle;
            }
            if(textFont){
                this.textFont = textFont;
            }
        }
    }
    /**
     * @class Coordinate
     * @description 坐标
     */
    export class Coordinate{
        /**
         * @property x
         * @type {number}
         */
        x:number;
        /**
         * @property y
         * @type {number}
         */
        y:number;

        /**
         * @constructor
         * @param x
         * @param y
         */
        constructor(x: number, y: number) {
            this.x = x;
            this.y = y;
        }
    }
    /**
     * @class OneKey
     * @description 一个字符
     */
    export class OneKey {
        /**
         * @property coordinate
         * @description 坐标
         * @type {Coordinate}
         */
        coordinate: Coordinate;
        /**
         * @property textFont
         * @description 文本字体
         * @type {string}
         */
        textFont: string = '1em microsoft yahei';
        /**
         * @property textStyle
         * @description 文本样式
         * @type {string}
         */
        textStyle: string = '#000';
        /**
         * @property textBaseline
         * @description 文本基线
         * @type {string}
         */
        textBaseline: string = 'top';
        /**
         * @property textAlign
         * @description 文本对齐
         * @type {string}
         */
        textAlign: string = 'center';
        /**
         * @property keyMaxWidth
         * @description 最大宽度
         * @type {number}
         */
        keyMaxWidth: number;
        /**
         * @property key
         * @description key 只能是一个字符
         * @type {string}
         * @private
         */
        private _key: string;
        get key(): string {
            return this._key;
        }

        set key(value: string) {
            if(!isNaN(Number(value))&&value.length<=2){
                this._key = value;
            }
            else if (value.length == 1) {
                this._key = value;
            } else {
                console.error('key值的长度只能为1');
            }
        }

        /**
         * @constructor
         * @param coordinate 坐标
         * @param key 单个字符
         * @param keyMaxWidth 最大宽度
         */
        constructor(coordinate: Coordinate, key: string, keyMaxWidth: number) {
            this.coordinate = coordinate;
            this.key = key;
            this.keyMaxWidth = keyMaxWidth;
        }
    }
    /**
     * @class StraightLine
     * @description 直线
     */
    export class StraightLine {
        /**
         * @property start
         * @description 起点
         * @type {Coordinate}
         */
        start: Coordinate;
        /**
         * @property end
         * @description 终点
         * @type {Coordinate}
         */
        end: Coordinate;
        /**
         * @property style
         * @description 样式
         * @type {string}
         */
        style: string;

        /**
         * @constructor
         * @param start 起点
         * @param end 终点
         * @param style 样式
         */
        constructor(start: Coordinate, end: Coordinate, style?: string) {
            this.start = start;
            this.end = end;
            if(style){
                this.style = style;
            }else{
                this.style = '#000';
            }
        }
    }
    /**
     * @class TextBox
     * @description 文本框
     */
    export class TextBox{
        /**
         * @property coordinate
         * @description 文本坐标
         * @type {Coordinate}
         */
        coordinate: Coordinate;
        /**
         * @property textFont
         * @description 文本字体
         * @type {string}
         */
        textFont: string = '0.9em microsoft yahei';
        /**
         * @property textStyle
         * @description 文本样式
         * @type {string}
         */
        textStyle: string = '#000';
        /**
         * @property textBaseline
         * @description 文本基线
         * @type {string}
         */
        textBaseline: string = 'top';
        /**
         * @property textAlign
         * @description 文本对齐
         * @type {string}
         */
        textAlign: string = 'left';
        /**
         * @property text
         * @description 文本
         * @type {string}
         */
        text:string;

        /**
         * @constructor
         * @param coordinate 坐标
         * @param text 文本
         */
        constructor(coordinate: Coordinate, text: string) {
            this.coordinate = coordinate;
            this.text = text;
        }
    }
}

/**
 * @module GraphicsModelModule
 * @description 绘画板的基本数据模型
 */
/**
 * @module GraphicsModelModule
 * @description 绘画板的基本数据模型
 */ export var GraphicsModelModule;
(function (GraphicsModelModule) {
    /**
     * @class Arrow
     * @description 箭头
     */
    class Arrow {
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
        constructor(coordinate, triangle_width, rectangle_width, triangle_height, rectangle_height, fillStyle, angle) {
            /**
             * @property triangle_width
             * @description 三角形的底边宽
             * @type {number}
             */
            this.triangle_width = 10;
            /**
             * @property rectangle_width
             * @description 长方形的宽
             * @type {number}
             */
            this.rectangle_width = 6;
            /**
             * @property triangle_height
             * @description 三角形的高
             * @type {number}
             */
            this.triangle_height = 8;
            /**
             * @property rectangle_height
             * @description 长方形的高
             * @type {number}
             */
            this.rectangle_height = 5;
            /**
             * @property fillStyle
             * @description 填充颜色
             * @type {number}
             */
            this.fillStyle = '#000';
            this.coordinate = coordinate;
            this.triangle_width = triangle_width;
            this.rectangle_width = rectangle_width;
            this.triangle_height = triangle_height;
            this.rectangle_height = rectangle_height;
            this.fillStyle = fillStyle;
            this.angle = angle;
        }
    }
    GraphicsModelModule.Arrow = Arrow;
    /**
     * @class Circle
     * @description 圆形
     */
    class Circle {
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
        constructor(coordinate, radius, text, fillStyle, borderStyle, textStyle, textFont) {
            /**
             * @property fillStyle
             * @description 填充样式
             * @type {string}
             */
            this.fillStyle = '#FFF';
            /**
             * @property borderStyle
             * @description 边框样式
             * @type {string}
             */
            this.borderStyle = '#000';
            /**
             * @property text
             * @description 文本
             * @type {string}
             */
            this.text = '';
            /**
             * @property textStyle
             * @description 文本样式
             * @type {string}
             */
            this.textStyle = '#000';
            /**
             * @property textFont
             * @description 文本字体
             * @type {string}
             */
            this.textFont = '1em microsoft yahei';
            /**
             * @property textBaseline
             * @description 文本基线
             * @type {string}
             */
            this.textBaseline = 'middle';
            /**
             * @property textAlign
             * @description 文本对其方式
             * @type {string}
             */
            this.textAlign = 'center';
            this.coordinate = coordinate;
            this.radius = radius;
            if (fillStyle) {
                this.fillStyle = fillStyle;
            }
            if (borderStyle) {
                this.borderStyle = borderStyle;
            }
            if (text) {
                this.text = text;
            }
            if (textStyle) {
                this.textStyle = textStyle;
            }
            if (textFont) {
                this.textFont = textFont;
            }
        }
    }
    GraphicsModelModule.Circle = Circle;
    /**
     * @class Coordinate
     * @description 坐标
     */
    class Coordinate {
        /**
         * @constructor
         * @param x
         * @param y
         */
        constructor(x, y) {
            this.x = x;
            this.y = y;
        }
    }
    GraphicsModelModule.Coordinate = Coordinate;
    /**
     * @class OneKey
     * @description 一个字符
     */
    class OneKey {
        /**
         * @constructor
         * @param coordinate 坐标
         * @param key 单个字符
         * @param keyMaxWidth 最大宽度
         */
        constructor(coordinate, key, keyMaxWidth) {
            /**
             * @property textFont
             * @description 文本字体
             * @type {string}
             */
            this.textFont = '1em microsoft yahei';
            /**
             * @property textStyle
             * @description 文本样式
             * @type {string}
             */
            this.textStyle = '#000';
            /**
             * @property textBaseline
             * @description 文本基线
             * @type {string}
             */
            this.textBaseline = 'top';
            /**
             * @property textAlign
             * @description 文本对齐
             * @type {string}
             */
            this.textAlign = 'center';
            this.coordinate = coordinate;
            this.key = key;
            this.keyMaxWidth = keyMaxWidth;
        }
        get key() {
            return this._key;
        }
        set key(value) {
            if (!isNaN(Number(value)) && value.length <= 2) {
                this._key = value;
            }
            else if (value.length == 1) {
                this._key = value;
            }
            else {
                console.error('key值的长度只能为1');
            }
        }
    }
    GraphicsModelModule.OneKey = OneKey;
    /**
     * @class StraightLine
     * @description 直线
     */
    class StraightLine {
        /**
         * @constructor
         * @param start 起点
         * @param end 终点
         * @param style 样式
         */
        constructor(start, end, style) {
            this.start = start;
            this.end = end;
            if (style) {
                this.style = style;
            }
            else {
                this.style = '#000';
            }
        }
    }
    GraphicsModelModule.StraightLine = StraightLine;
    /**
     * @class TextBox
     * @description 文本框
     */
    class TextBox {
        /**
         * @constructor
         * @param coordinate 坐标
         * @param text 文本
         */
        constructor(coordinate, text) {
            /**
             * @property textFont
             * @description 文本字体
             * @type {string}
             */
            this.textFont = '0.9em microsoft yahei';
            /**
             * @property textStyle
             * @description 文本样式
             * @type {string}
             */
            this.textStyle = '#000';
            /**
             * @property textBaseline
             * @description 文本基线
             * @type {string}
             */
            this.textBaseline = 'top';
            /**
             * @property textAlign
             * @description 文本对齐
             * @type {string}
             */
            this.textAlign = 'left';
            this.coordinate = coordinate;
            this.text = text;
        }
    }
    GraphicsModelModule.TextBox = TextBox;
})(GraphicsModelModule || (GraphicsModelModule = {}));
//# sourceMappingURL=GraphicsModelModule.js.map
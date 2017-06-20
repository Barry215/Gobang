export module GobangModule{
  import init = ECharts.init;
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

  export class Piece{
    coordinate: Coordinate;

    /**
     * 是否是黑子
     * @type {boolean}
     */
    isBlack: boolean;

    /**
     * 黑子外围泛色
     * @type {string}
     */
    blackPieceInColor: string = "#636766";

    /**
     * 黑子内围泛色
     * @type {string}
     */
    blackPieceOutColor: string = "#0A0A0A";

    /**
     * 白子外围泛色
     * @type {string}
     */
    whitePieceInColor: string = "#F9F9F9";

    /**
     * 白子内围泛色
     * @type {string}
     */
    whitePieceOutColor: string = "#D1D1D1";

    radius: number = 13;

    constructor(coordinate: Coordinate, isBlack: boolean, radius?: number, blackPieceInColor?: string, blackPieceOutColor?: string, whitePieceInColor?: string, whitePieceOutColor?: string) {
      this.coordinate = coordinate;
      this.isBlack = isBlack;
      if(radius){
        this.radius = radius;
      }
      if(blackPieceInColor){
        this.blackPieceInColor = blackPieceInColor;
      }
      if(blackPieceOutColor){
        this.blackPieceOutColor = blackPieceOutColor;
      }
      if(whitePieceInColor){
        this.whitePieceInColor = whitePieceInColor;
      }
      if(whitePieceOutColor){
        this.whitePieceOutColor = whitePieceOutColor;
      }
    }
  }

  export class GameInit{
    counts : number = 0;
    wins : number[][][] = [];
    axisCount : number = 15;
    manScore : number[][] = [];
    computerScore : number[][] = [];

    constructor(axisCount?:number){
      if (axisCount){
        this.axisCount = axisCount;
      }

      // 初始化赢法的三维数组
      for (let i = 0; i < this.axisCount; i++) {
        this.wins[i] = [];
        for (let j = 0; j < this.axisCount; j++) {
          this.wins[i][j] = [];
        }
      }

      // 初始化分数的二维数组
      for (let i = 0; i < 15; i++) {
        this.manScore[i] = [];
        this.computerScore[i] = [];
        for (let j = 0; j < 15; j++) {
          this.manScore[i][j] = 0;
          this.computerScore[i][j] = 0;
        }
      }

      // 纵向90°的赢法
      for (let i = 0; i < this.axisCount; i++) {
        for (let j = 0; j < this.axisCount-4; j++) {
          for (let k = 0; k < 5; k++) {
            this.wins[i][j + k][this.counts] = 1;
          }
          this.counts++;
        }
      }

      // 横向0°的赢法
      for (let i = 0; i < this.axisCount; i++) {
        for (let j = 0; j < this.axisCount-4; j++) {
          for (let k = 0; k < 5; k++) {
            this.wins[j + k][i][this.counts] = 1;
          }
          this.counts++;
        }
      }

      // 斜向135°的赢法
      for (let i = 0; i < this.axisCount-4; i++) {
        for (let j = 0; j < this.axisCount-4; j++) {
          for (let k = 0; k < 5; k++) {
            this.wins[i + k][j + k][this.counts] = 1;
          }
          this.counts++;
        }
      }

      // 斜向45°的赢法
      for (let i = 0; i < this.axisCount-4; i++) {
        for (let j = this.axisCount-1; j > 3; j--) {
          for (let k = 0; k < 5; k++) {
            this.wins[i + k][j - k][this.counts] = 1;
          }
          this.counts++;
        }
      }
    }

    private init(){
      // let a = [];
      // for (let i = 0; i < this.axisCount; i++) {
      //   let b = [];
      //   for (let j = 0; j < this.axisCount; j++) {
      //     let c = [];
      //     for (let k = 0; k < 500; k++) {
      //       c.push(0);
      //     }
      //     b.push(c);
      //   }
      //   a.push(b);
      // }
      // this.wins.push(a);
    }

  }

  export interface Gobang {

    /**
     * 画棋子
     * @param element
     */
    drawPiece(element: Piece);

  }

  export class GobangImpl implements Gobang{

    canvas: HTMLCanvasElement;
    content2D: CanvasRenderingContext2D;

    constructor(canvas: HTMLCanvasElement) {
      this.canvas = canvas;
      this.content2D = this.canvas.getContext('2d');
    }

    drawPiece(element: Piece){
      this.content2D.beginPath();
      this.content2D.arc(15 + element.coordinate.x * 30, 15 + element.coordinate.y * 30, element.radius, 0, 2 * Math.PI);
      this.content2D.closePath();
      let gradient = this.content2D.createRadialGradient(15 + element.coordinate.x * 30 + 2, 15 + element.coordinate.y * 30 - 2, element.radius, 15 + element.coordinate.x * 30 + 2, 15 + element.coordinate.y * 30 - 2, 0);
      if (!element.isBlack) {
        gradient.addColorStop(0, element.whitePieceOutColor);
        gradient.addColorStop(1, element.whitePieceInColor);
      } else {
        gradient.addColorStop(0, element.blackPieceOutColor);
        gradient.addColorStop(1, element.blackPieceInColor);
      }
      this.content2D.fillStyle = gradient;
      this.content2D.fill();
    }


  }
}

/**
 * Created by frank on 17/6/20.
 */
export module ChessBoardModule {
  /**
   * 五子棋坐标
   */
  export class Coordinate{
    x:number;
    y:number;
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

  export class Chess{

    canvas : HTMLCanvasElement;

    context2D : CanvasRenderingContext2D;

    constructor(canvas: HTMLCanvasElement) {
      this.canvas = canvas;
      this.context2D = this.canvas.getContext('2d');
    }

    initBoard(){
      for (let i = 0; i < 15; i++) {
        //画竖线
        this.context2D.beginPath();
        this.context2D.moveTo(15 + i * 30, 15);
        this.context2D.lineTo(15 + i * 30, this.canvas.height - 15);
        this.context2D.strokeStyle = '#8a8a8a';
        this.context2D.stroke();
        //画直线
        this.context2D.moveTo(15, 15 + i * 30);
        this.context2D.lineTo(this.canvas.width - 15, 15 + i * 30);
        this.context2D.strokeStyle = '#BFBFBF';
        this.context2D.stroke();
        this.context2D.closePath();
      }
    }
  }



}

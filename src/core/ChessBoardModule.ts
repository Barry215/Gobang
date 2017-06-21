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

  /**
   * 五子棋棋子
   */
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

    /**
     * 棋子半径
     * @type {number}
     */
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

  /**
   * 棋盘
   */
  export class Chess{

    canvas : HTMLCanvasElement;

    context2D : CanvasRenderingContext2D;

    gameOver : boolean = false;

    isBlack : boolean = true;

    yourTurn : boolean = true;

    isFirst : boolean = true;

    chessBoard : number[][] = [];

    constructor(canvas: HTMLCanvasElement) {
      this.canvas = canvas;
      this.context2D = this.canvas.getContext('2d');
      // this.initBoard();
    }

    /**
     * 棋盘初始化绘制
     */
    initBoard(){
      for (let i = 0; i < 15; i++) {
        //画竖线
        this.context2D.beginPath();
        this.context2D.moveTo(15 + i * 30, 15);
        this.context2D.lineTo(15 + i * 30, this.canvas.height - 15);
        this.context2D.strokeStyle = '#8a8a8a';
        this.context2D.stroke();

        //画直线
        this.context2D.beginPath();
        this.context2D.moveTo(15, 15 + i * 30);
        this.context2D.lineTo(this.canvas.width - 15, 15 + i * 30);
        this.context2D.strokeStyle = '#BFBFBF';
        this.context2D.stroke();
      }
    }

    /**
     * 初始化棋局
     */
    startChess(isBlack:boolean, isFirst:boolean){
      this.gameOver = false;
      this.isFirst = isFirst;
      this.yourTurn = isFirst;
      this.isBlack = isBlack;

      for (let i = 0; i < 15; i++) {
        this.chessBoard[i] = [];
        for (let j = 0; j < 15; j++) {
          this.chessBoard[i][j] = 0;
        }
      }
    }

    /**
     * 落子
     */
    drawChessPiece(element: Piece){
      this.context2D.beginPath();
      this.context2D.arc(15 + element.coordinate.x * 30, 15 + element.coordinate.y * 30, element.radius, 0, 2 * Math.PI);
      let gradient = this.context2D.createRadialGradient(15 + element.coordinate.x * 30 + 2, 15 + element.coordinate.y * 30 - 2, element.radius, 15 + element.coordinate.x * 30 + 2, 15 + element.coordinate.y * 30 - 2, 0);
      if (!element.isBlack) {
        gradient.addColorStop(0, element.whitePieceOutColor);
        gradient.addColorStop(1, element.whitePieceInColor);
      } else {
        gradient.addColorStop(0, element.blackPieceOutColor);
        gradient.addColorStop(1, element.blackPieceInColor);
      }
      this.context2D.fillStyle = gradient;
      this.context2D.fill();
    }

    /**
     * 初始化点击事件
     */
    initClick(){
      let that = this;
      this.canvas.onclick = function (clickEvent){

        if (!that.yourTurn){
            return;
        }
        const x = clickEvent.offsetX;
        const y = clickEvent.offsetY;
        const i = Math.floor(x / 30);
        const j = Math.floor(y / 30);

        //落子
        that.drawChessPiece(new Piece(new Coordinate(i, j), that.isBlack));
        that.yourTurn = false;
      }
    }

  }



}

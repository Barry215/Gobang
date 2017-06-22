import {ChessAIModule} from "./ChessAIModule";
/**
 * Created by frank on 17/6/20.
 */
export module ChessBoardModule {
  import ChessAIImpl1 = ChessAIModule.ChessAIImpl1;
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

    constructor(canvas: HTMLCanvasElement) {
      this.canvas = canvas;
      this.context2D = this.canvas.getContext('2d');
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
     * 设置canvas大小
     * @param height
     * @param width
     */
    resize(height: number, width: number) {
      this.canvas.setAttribute('width', String(width));
      this.canvas.setAttribute('height', String(height));
    }

    /**
     * 落子
     * @param element
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
     * @param t
     */
    initClick(t:any){
      let that = this;
      this.canvas.onclick = function (clickEvent){
        if (t.gameOver) {
          return;
        }

        if (!t.yourTurn){
            return;
        }
        const x = clickEvent.offsetX;
        const y = clickEvent.offsetY;
        const i = Math.floor(x / 30);
        const j = Math.floor(y / 30);

        //判断是否已有子
        if (t.chessBoard[i][j] != 0) {
          return;
        }

        that.drawChessPiece(new Piece(new Coordinate(i, j), t.isBlack));
        t.yourTurn = false;
        t.chessBoard[i][j] = 1;

        t.chessAIImpl1.handleManStep(i,j);
        if (t.chessAIImpl1.isManWin()){
          that.handleGameOver(t);
          window.alert("恭喜您打败了阿尔法狗!");
        }

        let coordinate = t.chessAIImpl1.computerStep(t.chessBoard);
        that.drawChessPiece(new Piece(coordinate, !t.isBlack));

        t.chessBoard[coordinate.x][coordinate.y] = 2;
        t.yourTurn = true;

        if (t.chessAIImpl1.isComputerWin()){
          that.handleGameOver(t);
          window.alert("向人工智能低头吧!");
        }
      }
    }

    /**
     * 电脑下第一步
     * @param t
     */
    computerFirstStep(t:any){
      this.drawChessPiece(new Piece(new Coordinate(7,7), !t.isBlack));

      t.chessBoard[7][7] = 2;
      t.yourTurn = true;
    }

    /**
     * 游戏结束
     * @param t
     */
    handleGameOver(t:any){
      t.gameOver = true;
      t.btn_able = false;
      t.button_text = "再来一局";
    }

    gameAgain(t:any){
      this.context2D.clearRect(0,0,450,450);
      this.initBoard();
      for (let i = 0; i < 15; i++) {
        t.chessBoard[i] = [];
        for (let j = 0; j < 15; j++) {
          t.chessBoard[i][j] = 0;
        }
      }
      t.gameOver = false;
    }

  }

}

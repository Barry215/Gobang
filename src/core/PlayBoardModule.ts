import {ChessBoardModule} from "./ChessBoardModule";
import Coordinate = ChessBoardModule.Coordinate;
import Piece = ChessBoardModule.Piece;


export class PlayChess{

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
   * 更新棋盘
   * @param t
   * @param newChessBoard
   */
  drawAllChessPiece(t:any, newChessBoard: number[][]){
    for (let i = 0; i < 15; i++) {
      for (let j = 0; j < 15; j++) {
        if (t.chessBoard[i][j] == 0 && newChessBoard[i][j] != 0){
          this.drawChessPiece(new Piece(new Coordinate(i, j), newChessBoard[i][j] == 1));
        }
      }
    }

    t.chessBoard = newChessBoard;
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

      if (!t.myTurn){
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

      that.drawChessPiece(new Piece(new Coordinate(i, j), t.nextBlack));
      t.myTurn = false;
      if (t.isAfter){
        t.chessBoard[i][j] = 2;
      }else {
        t.chessBoard[i][j] = 1;
      }

      t.socket.emit('pushChessBoard', {againstId: t.againstId, chessBoard: JSON.stringify(t.chessBoard), nextBlack: !t.nextBlack});

    }
  }



  /**
   * 游戏结束
   * @param t
   */
  handleGameOver(t:any){
    t.gameOver = true;
    t.btn_start_able = false;
    t.button_start = "再来一局";
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

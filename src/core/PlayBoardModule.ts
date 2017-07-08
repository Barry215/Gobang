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
   * 画新棋子的标记
   * @param coordinate 新棋子坐标
   */
  drawHighLight(coordinate : Coordinate){
    //画竖线
    this.context2D.beginPath();
    this.context2D.moveTo(15 + coordinate.x * 30, 15 + coordinate.y * 30 + 4);
    this.context2D.lineTo(15 + coordinate.x * 30, 15 + coordinate.y * 30 - 4);
    this.context2D.strokeStyle = '#f82a15';
    this.context2D.stroke();

    //画直线
    this.context2D.beginPath();
    this.context2D.moveTo(15 + coordinate.x * 30 - 4, 15 + coordinate.y * 30);
    this.context2D.lineTo(15 + coordinate.x * 30 + 4, 15 + coordinate.y * 30);
    this.context2D.strokeStyle = '#f82a15';
    this.context2D.stroke();
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
          this.drawHighLight(new Coordinate(i, j));
          if (t.chessBoardList.length != 0){
            this.drawChessPiece(new Piece(new Coordinate(t.oldX, t.oldY), t.chessBoard[t.oldX][t.oldY] == 1));
          }
          t.oldX = i;
          t.oldY = j;
          t.chessBoard[i][j] = newChessBoard[i][j];
          t.chessBoardList.push(JSON.parse(JSON.stringify(t.chessBoard)));
          console.log("chessBoardList:" + JSON.stringify(t.chessBoardList));

        }
      }
    }
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
      that.drawHighLight(new Coordinate(i, j));
      if (t.chessBoardList.length != 0){
        that.drawChessPiece(new Piece(new Coordinate(t.oldX, t.oldY), !t.nextBlack));
      }
      t.oldX = i;
      t.oldY = j;


      t.myTurn = false;
      if (!t.nextBlack){
        t.chessBoard[i][j] = 2;
      }else {
        t.chessBoard[i][j] = 1;
      }

      t.chessBoardList.push(JSON.parse(JSON.stringify(t.chessBoard)));
      // t.chessBoardList.push(t.chessBoard.slice());

      console.log("chessBoardList:" + JSON.stringify(t.chessBoardList));

      if (t.forgiveAble){
        t.forgiveAble = false;
      }


      t.socket.emit('pushChessBoard', {againstId: t.againstId, chessBoard: JSON.stringify(t.chessBoard), nextBlack: !t.nextBlack});

      that.handleGameOver(t);
    }
  }


  /**
   * 判断游戏是否结束
   * @param t
   * @returns {number} 0 游戏未结束 1 黑子赢 2 白子赢
   */
  isGameOver(t:any): number {
    let count = 0;

    // 纵向90°的五子判断
    for (let i = 0; i < 15; i++) {
      for (let j = 0; j < 11; j++) {
        count = 0;
        for (let k = 0; k < 5; k++) {
          if (t.chessBoard[i][j + k] == 0){
            count = 0;
            break;
          }else {
            count += t.chessBoard[i][j + k];
          }
        }
        if (count == 5){
          return 1;
        }else if (count == 10){
          return 2;
        }
      }
    }

    // 横向0°的五子判断
    for (let i = 0; i < 15; i++) {
      for (let j = 0; j < 11; j++) {
        count = 0;
        for (let k = 0; k < 5; k++) {
          if (t.chessBoard[j + k][i] == 0){
            count = 0;
            break;
          }else {
            count += t.chessBoard[j + k][i];
          }
        }
        if (count == 5){
          return 1;
        }else if (count == 10){
          return 2;
        }
      }
    }

    // 斜向135°的五子判断'\'方向
    for (let i = 0; i < 11; i++) {
      for (let j = 0; j < 11; j++) {
        count = 0;
        for (let k = 0; k < 5; k++) {
          if (t.chessBoard[i + k][j + k] == 0){
            count = 0;
            break;
          }else {
            count += t.chessBoard[i + k][j + k];
          }
        }
        if (count == 5){
          return 1;
        }else if (count == 10){
          return 2;
        }
      }
    }

    // 斜向45°的五子判断'/'方向
    for (let i = 0; i < 11; i++) {
      for (let j = 14; j > 3; j--) {
        count = 0;
        for (let k = 0; k < 5; k++) {
          if (t.chessBoard[i + k][j - k] == 0){
            count = 0;
            break;
          }else {
            count += t.chessBoard[i + k][j - k];
          }
        }
        if (count == 5){
          return 1;
        }else if (count == 10){
          return 2;
        }
      }
    }

    return 0;
  }

  /**
   * 处理游戏结束
   * @param t
   */
  handleGameOver(t:any) {
    if (!t.gameOver){
      let gameResult = this.isGameOver(t);

      if (gameResult != 0){
        t.socket.emit('gameOver');
        t.gameOver = true;
        t.turnMsgShow = false;
        t.button_start = "再来一局";
        t.btn_start_able = false;
        t.forgiveAble = true;
        t.invite_able = true;
        if (gameResult == 1 && !t.isAfter || gameResult == 2 && t.isAfter){
          t.isGameWin = true;
        }else {
          t.isGameWin = false;
        }

        t.modal_show5 = true;
      }
    }

  }

  forgiveChess(t:any,isSubmitUser:boolean){
    this.context2D.clearRect(0,0,450,450);
    this.initBoard();
    if (isSubmitUser != t.myTurn) {
      t.chessBoardList.pop();
      console.log("chessBoardList推出"+JSON.stringify(t.chessBoardList));

      t.chessBoard[t.oldX][t.oldY] = 0;

      if (t.chessBoardList.length != 0){
        for (let i = 0; i < 15; i++) {
          for (let j = 0; j < 15; j++) {
            if (t.chessBoard[i][j] != 0){
              this.drawChessPiece(new Piece(new Coordinate(i, j), t.chessBoard[i][j] == 1));
              if (t.chessBoardList.length == 1){
                this.drawHighLight(new Coordinate(i, j));
                t.oldX = i;
                t.oldY = j;
              }else {
                if (t.chessBoardList[t.chessBoardList.length - 2][i][j] == 0){
                  this.drawHighLight(new Coordinate(i, j));
                  t.oldX = i;
                  t.oldY = j;
                }
              }
            }
          }
        }
      }
    }else {
      t.chessBoardList.pop();
      // console.log("chessBoardList推出："+JSON.stringify(t.chessBoardList));
      t.chessBoardList.pop();
      // console.log("chessBoardList推出："+JSON.stringify(t.chessBoardList));


      if (t.chessBoardList.length != 0){
        // console.log("chessBoardList末尾："+JSON.stringify(t.chessBoardList[t.chessBoardList.length-1]));
        // t.chessBoard = t.chessBoardList[t.chessBoardList.length-1]; 不知道为什么赋值无效

        for (let i = 0; i < 15; i++) {
          for (let j = 0; j < 15; j++) {
            if (t.chessBoardList[t.chessBoardList.length-1][i][j] != 0){
              this.drawChessPiece(new Piece(new Coordinate(i, j), t.chessBoard[i][j] == 1));
              if (t.chessBoardList.length == 1){
                this.drawHighLight(new Coordinate(i, j));
                t.oldX = i;
                t.oldY = j;
              }else {
                if (t.chessBoardList[t.chessBoardList.length - 2][i][j] == 0){
                  this.drawHighLight(new Coordinate(i, j));
                  t.oldX = i;
                  t.oldY = j;
                }
              }
            }else {
              t.chessBoard[i][j] = 0;
            }
          }
        }
      }else {
        for (let i = 0; i < 15; i++) {
          for (let j = 0; j < 15; j++) {
            t.chessBoard[i][j] = 0;
          }
        }
        t.oldX = 0;
        t.oldY = 0;
      }
      // console.log("chessBoard更新："+JSON.stringify(t.chessBoard));
    }

    t.notice_success("悔棋成功！");
    if (isSubmitUser){
        t.myTurn = true;
    }else {
        t.myTurn = false;
    }

  }

  /**
   * 处理认输
   * @param t
   * @param mySurrender
   */
  handleSurrender(t:any,mySurrender:boolean){
    t.socket.emit('gameOver');
    t.gameOver = true;
    t.turnMsgShow = false;
    t.button_start = "再来一局";
    t.btn_start_able = false;
    t.forgiveAble = true;
    t.invite_able = true;
    t.isGameWin = !mySurrender;
    t.modal_show5 = true;
  }

  /**
   * 再来游戏的配置
   * @param t
   */
  gameAgain(t:any){
    this.context2D.clearRect(0,0,450,450);
    this.initBoard();
    for (let i = 0; i < 15; i++) {
      for (let j = 0; j < 15; j++) {
        t.chessBoard[i][j] = 0;
      }
    }
    t.chessBoardList.splice(0,t.chessBoardList.length);
    t.oldX = 0;
    t.oldY = 0;
    t.gameOver = false;
  }

}

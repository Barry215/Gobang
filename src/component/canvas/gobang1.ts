import * as Vue from 'vue';
import './gobang1.css'
import {GraphicsModule} from "../../core/GraphicsModule";
import GraphicsCanvasImpl = GraphicsModule.GraphicsCanvasImpl;
import {GraphicsModelModule} from "../../core/GraphicsModelModule";
import StraightLine = GraphicsModelModule.StraightLine;
import Circle = GraphicsModelModule.Circle;
import {GobangModule} from "../../core/GobangModule";
import GobangImpl = GobangModule.GobangImpl;
import Piece = GobangModule.Piece;
import Coordinate = GobangModule.Coordinate;
import GameInit = GobangModule.GameInit;

export default Vue.extend({
  template: require('./gobang1.html'),
  data(){
    return {
      isBlack: true,
      counts: 0,
      wins: [],
      manWins: [],
      computerWins: [],
      gameOver: false
    }
  },
  computed: {
    chessBoard: function () {
      let chessBoard = [];
      for (let i = 0; i < 15; i++) {
        chessBoard[i] = [];
        for (let j = 0; j < 15; j++) {
          chessBoard[i][j] = 0;
        }
      }
      return chessBoard;
    }
  },
  methods: {

  },
  mounted(){
    let t: any = this;

    //初始化赢法总数和赢法全路径数组
    let gameInit = new GameInit();
    t.counts = gameInit.counts;
    t.wins = gameInit.wins;

    // 初始化赢法统计数组
    for (let i = 0; i < t.counts; i++) {
      t.manWins[i] = 0;
      t.computerWins[i] = 0;
    }

    //绘制棋盘
    let canvas = <HTMLCanvasElement>document.getElementById('canvas');
    let graphics = new GraphicsCanvasImpl(canvas);
    graphics.resize(450, 450);
    for (let i = 0; i < 15; i++) {
      graphics.drawStraightLine(new StraightLine(new Coordinate(15 + i * 30, 15), new Coordinate(15 + i * 30, canvas.height - 15), '#8a8a8a'));
      graphics.drawStraightLine(new StraightLine(new Coordinate(15, 15 + i * 30), new Coordinate(canvas.width - 15, 15 + i * 30), '#BFBFBF'));
    }

    let gobangImpl = new GobangImpl(canvas);

    //初始化棋盘点击事件
    canvas.onclick = function (clickEvent) {
      if (t.gameOver) {
        return;
      }

      const x = clickEvent.offsetX;
      const y = clickEvent.offsetY;
      const i = Math.floor(x / 30);
      const j = Math.floor(y / 30);
      if (t.chessBoard[i][j] == 0) {
        gobangImpl.drawPiece(new Piece(new Coordinate(i, j), t.isBlack));
        //换子
        t.isBlack = !t.isBlack;
        //占好位置
        t.chessBoard[i][j] = 1;
        //遍历所有赢法，判断每个赢法下的已得数，若为5则获胜
        for (let k = 0; k < t.counts; k++) {
          if (t.wins[i][j][k] == 1) {
            t.manWins[k]++;
            t.computerWins[k] = 6;
            if (t.manWins[k] == 5) {
              t.gameOver = true;
              window.alert("恭喜您打败了阿尔法狗!");
            }
          }
        }

        if (!t.gameOver) {
          let u = 0;                // 电脑预落子的x位置
          let v = 0;                // 电脑预落子的y位置
          let manScore = gameInit.manScore;
          let computerScore = gameInit.computerScore;
          let max = 0;              // 最优位置的分数


          for (let i = 0; i < 15; i++) {
            for (let j = 0; j < 15; j++) {
              if (t.chessBoard[i][j] == 0) {
                for (let k = 0; k < t.counts; k++) {
                  if (t.wins[i][j][k] == 1) {
                    if (t.manWins[k] == 1) {
                      manScore[i][j] += 200;
                    } else if (t.manWins[k] == 2) {
                      manScore[i][j] += 400;
                    } else if (t.manWins[k] == 3) {
                      manScore[i][j] += 2000;
                    } else if (t.manWins[k] == 4) {
                      manScore[i][j] += 10000;
                    }
                    if (t.computerWins[k] == 1) {
                      computerScore[i][j] += 220;
                    } else if (t.computerWins[k] == 2) {
                      computerScore[i][j] += 420;
                    } else if (t.computerWins[k] == 3) {
                      computerScore[i][j] += 2100;
                    } else if (t.computerWins[k] == 4) {
                      computerScore[i][j] += 20000;
                    }
                  }
                }

                // 如果玩家(i,j)处比目前最优的分数大，则落子在(i,j)处
                if (manScore[i][j] > max) {
                  max = manScore[i][j];
                  u = i;
                  v = j;
                } else if (manScore[i][j] == max) {
                  // 如果玩家(i,j)处和目前最优分数一样大，则比较电脑在该位置和预落子的位置的分数
                  if (computerScore[i][j] > computerScore[u][v]) {
                    u = i;
                    v = j;
                  }
                }

                // 如果电脑(i,j)处比目前最优的分数大，则落子在(i,j)处
                if (computerScore[i][j] > max) {
                  max  = computerScore[i][j];
                  u = i;
                  v = j;
                } else if (computerScore[i][j] == max) {
                  // 如果电脑(i,j)处和目前最优分数一样大，则比较玩家在该位置和预落子的位置的分数
                  if (manScore[i][j] > manScore[u][v]) {
                    u = i;
                    v = j;
                  }
                }
              }
            }
          }
          gobangImpl.drawPiece(new Piece(new Coordinate(u, v), t.isBlack));
          t.isBlack = !t.isBlack;
          t.chessBoard[u][v] = 2;

          for (let k = 0; k < t.counts; k++) {
            if (t.wins[u][v][k] == 1) {
              t.computerWins[k] ++;
              t.manWins[k] = 6;
              if (t.computerWins[k] == 5) {
                t.gameOver = true;
                window.alert("向人工智能低头吧!");
              }
            }
          }

        }
      }
    }
  }

})

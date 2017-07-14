/**
 * Created by 麦金 on 2017/7/14.
 */
import {ChessAIModule} from "./ChessAIModule";
import ChessAI = ChessAIModule.ChessAI;
import {ChessBoardModule} from "./ChessBoardModule";
import Coordinate = ChessBoardModule.Coordinate;
/**
 * 五子棋算法实现一
 */
export class ChessAIImpl1 implements ChessAI{

  counts: number = 0;

  wins: number[][][] = [];

  manWins: number[] = [];

  computerWins: number[] = [];

  constructor(){
    //初始化赢法数组
    for (let i = 0; i < 15; i++) {
      this.wins[i] = [];
      for (let j = 0; j < 15; j++) {
        this.wins[i][j] = [];
      }
    }

    // 纵向90°的赢法计数
    for (let i = 0; i < 15; i++) {
      for (let j = 0; j < 11; j++) {
        for (let k = 0; k < 5; k++) {
          this.wins[i][j + k][this.counts] = 1;
        }
        this.counts++;
      }
    }

    // 横向0°的赢法计数
    for (let i = 0; i < 15; i++) {
      for (let j = 0; j < 11; j++) {
        for (let k = 0; k < 5; k++) {
          this.wins[j + k][i][this.counts] = 1;
        }
        this.counts++;
      }
    }

    // 斜向135°的赢法计数
    for (let i = 0; i < 11; i++) {
      for (let j = 0; j < 11; j++) {
        for (let k = 0; k < 5; k++) {
          this.wins[i + k][j + k][this.counts] = 1;
        }
        this.counts++;
      }
    }

    // 斜向45°的赢法计数
    for (let i = 0; i < 11; i++) {
      for (let j = 14; j > 3; j--) {
        for (let k = 0; k < 5; k++) {
          this.wins[i + k][j - k][this.counts] = 1;
        }
        this.counts++;
      }
    }

    // 初始化用户和电脑的各种赢法得分(最高5分)
    for (let i = 0; i < this.counts; i++) {
      this.manWins[i] = 0;
      this.computerWins[i] = 0;
    }
  }

  handleManStep(x: number, y: number) {
    for (let k = 0; k < this.counts; k++) {
      if (this.wins[x][y][k] == 1) {
        this.manWins[k]++;
        this.computerWins[k] = 6;
      }
    }
  }

  computerStep(chessBoard:number[][]): Coordinate {
    let u = 0;                // 电脑预落子的x位置
    let v = 0;                // 电脑预落子的y位置
    let max = 0;              // 最优位置的分数
    let manScore = [];
    let computerScore = [];

    //初始化分数数组
    for (let i = 0; i < 15; i++) {
      manScore[i] = [];
      computerScore[i] = [];
      for (let j = 0; j < 15; j++) {
        manScore[i][j] = 0;
        computerScore[i][j] = 0;
      }
    }

    for (let i = 0; i < 15; i++) {
      for (let j = 0; j < 15; j++) {
        if (chessBoard[i][j] == 0) {
          for (let k = 0; k < this.counts; k++) {
            if (this.wins[i][j][k] == 1) {
              if (this.manWins[k] == 1) {
                manScore[i][j] += 100;
              } else if (this.manWins[k] == 2) {
                manScore[i][j] += 500;
              } else if (this.manWins[k] == 3) {
                manScore[i][j] += 2500;
              } else if (this.manWins[k] == 4) {
                manScore[i][j] += 10000;
              }
              if (this.computerWins[k] == 1) {
                computerScore[i][j] += 300;
              } else if (this.computerWins[k] == 2) {
                computerScore[i][j] += 1000;
              } else if (this.computerWins[k] == 3) {
                computerScore[i][j] += 3000;
              } else if (this.computerWins[k] == 4) {
                computerScore[i][j] += 30000;
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

    for (let k = 0; k < this.counts; k++) {
      if (this.wins[u][v][k] == 1) {
        this.computerWins[k] ++;
        this.manWins[k] = 6;
      }
    }

    return new Coordinate(u,v);
  }

  isManWin(chessBoard: number[][]):boolean {
    for (let k = 0; k < this.counts; k++) {
      if (this.manWins[k] == 5){
        return true;
      }
    }
    return false;
  }

  isComputerWin(chessBoard: number[][]):boolean {
    for (let k = 0; k < this.counts; k++) {
      if (this.computerWins[k] == 5){
        return true;
      }
    }
    return false;
  }

  /**
   * 重置赢法数组
   */
  cleanWins(chessAI : ChessAIImpl1) {
    for (let i = 0; i < this.counts; i++) {
      chessAI.manWins[i] = 0;
      chessAI.computerWins[i] = 0;
    }
  }

}

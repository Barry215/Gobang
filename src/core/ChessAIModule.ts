import {ChessBoardModule} from "./ChessBoardModule";

export module ChessAIModule {

  import Coordinate = ChessBoardModule.Coordinate;

  /**
   * 五子棋算法接口
   */
  export interface ChessAI{
    /**
     * 判断是否游戏结束
     */
    isGameOver();

    /**
     * 计算机落子位置
     */
    computerStep():Coordinate;

  }

  /**
   * 五子棋算法实现一
   */
  export class ChessAIImpl1 implements ChessAI{

    counts: number = 0;

    wins: number[][][] = [];

    manWins: number[] = [];

    computerWins: number[] = [];

    manScore : number[][] = [];

    computerScore : number[][] = [];

    constructor(){
      //初始化分数数组
      for (let i = 0; i < 15; i++) {
        this.manScore[i] = [];
        this.computerScore[i] = [];
        for (let j = 0; j < 15; j++) {
          this.manScore[i][j] = 0;
          this.computerScore[i][j] = 0;
        }
      }

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


    isGameOver() {

    }

    computerStep(): Coordinate {
      return new Coordinate(0,0);
    }

  }


}

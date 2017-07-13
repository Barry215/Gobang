import {ChessBoardModule} from "./ChessBoardModule";

export module ChessAIModule {

  import Coordinate = ChessBoardModule.Coordinate;

  /**
   * 五子棋算法接口
   */
  export interface ChessAI{
    /**
     * 判断是否玩家获胜
     */
    isManWin(chessBoard: number[][]):boolean;

    /**
     * 判断是否电脑获胜
     */
    isComputerWin(chessBoard: number[][]):boolean;

    /**
     * 处理玩家落子结果
     */
    handleManStep(x: number,y: number);

    /**
     * 计算机落子位置
     */
    computerStep(chessBoard: number[][]):Coordinate;

    /**
     * 重置赢法数组
     */
    cleanWins(chessAI : ChessAI);
  }

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

  export class ChessAIImpl2 implements ChessAI{

    isManWin(chessBoard: number[][]): boolean {
      return this.isGameOver(chessBoard) == 1;
    }

    isComputerWin(chessBoard: number[][]): boolean {
      return this.isGameOver(chessBoard) == 2;
    }

    handleManStep(x: number, y: number) {

    }

    computerStep(chessBoard: number[][]): Coordinate {
      let startTime = new Date().getTime();

      let historyScoreMore = -100000;
      let chessBoardScoreMax = -100000;
      let winStep = 10;
      let perfectCoordinate = []; //0:x,1:y
      let normalCoordinate = []; //0:x,1:y
      let winCoordinate = []; //0:x,1:y
      let lastChessBoardScore = this.evaluate(chessBoard);

      for (let i = 0; i < 15; i++){
        for (let j = 0; j < 15; j++){
          if(chessBoard[i][j] == 0 && this.hasNeighbor(new Coordinate(i,j), chessBoard)) {
            let chessBoardNext = JSON.parse(JSON.stringify(chessBoard));
            chessBoardNext[i][j] = 2;

            //如果五子连珠
            if (this.isGameOver(chessBoardNext) == 2){
              console.log("computerStep:"+(new Date().getTime()-startTime));
              return new Coordinate(i,j);
            }

            let chessBoardScore = this.evaluate(chessBoardNext);
            //当前局面哪个位置得分最高
            if (chessBoardScore > chessBoardScoreMax){
              chessBoardScoreMax = chessBoardScore;
              normalCoordinate[0] = i;
              normalCoordinate[1] = j;
            }
            //剪枝，当前分数要大于玩家下后的棋面分数
            if (lastChessBoardScore <= chessBoardScore){
              //选出历史分数中最大的那一步

              let dfsResult = this.dfsChessBoard(1,chessBoardNext,chessBoardScore,false);

              if (dfsResult.existGameOver == 1){
                // continue;
              }else if (dfsResult.existGameOver == 2){
                if (dfsResult.winStep < winStep){
                  winStep = dfsResult.winStep;
                  winCoordinate[0] = i;
                  winCoordinate[1] = j;
                }
              }else {
                if (dfsResult.historyScore > historyScoreMore){
                  perfectCoordinate[0] = i;
                  perfectCoordinate[1] = j;
                  historyScoreMore = dfsResult.historyScore;
                }
              }
            }
          }
        }
      }

      console.log("computerStep:"+(new Date().getTime()-startTime));

      if (winStep == 10){
        if (historyScoreMore == -100000){
          return new Coordinate(normalCoordinate[0],normalCoordinate[1]);
        }else {
          return new Coordinate(perfectCoordinate[0],perfectCoordinate[1]);
        }
      }else {
        return new Coordinate(winCoordinate[0],winCoordinate[1]);
      }
    }

    /**
     * 综合分数为电脑得分 - 玩家得分
     * 深度优先预测未来棋子得分,电脑下的综合分数不能比上盘玩家下的低，玩家下的综合分数不能比电脑下的高
     * @param depth 深度
     * @param chessBoard 上一层棋盘
     * @param lastChessBoardScore 上一层的得分
     * @param isMax 是否当前是max层 这是博弈树极大值极小值的术语，max指电脑层
     */
    dfsChessBoard(depth: number, chessBoard: number[][], lastChessBoardScore: number, isMax: boolean): dfsResult{
      let startTime = new Date().getTime();

      const myDot = isMax ? 2 : 1;

      let chessBoardScoreMin = 100000;

      for (let i = 0; i < 15; i++){
        for (let j = 0; j < 15; j++){
          if(chessBoard[i][j] == 0 && this.hasNeighbor(new Coordinate(i,j), chessBoard)) {
            let chessBoardNext = JSON.parse(JSON.stringify(chessBoard));
            chessBoardNext[i][j] = myDot;
            //如果五子连珠
            let isOver = this.isGameOver(chessBoardNext);
            if (isOver == 2){
              console.log("dfsChessBoard:"+(new Date().getTime()-startTime));

              return new dfsResult(0,2,4-depth);
            }else if (isOver == 1){
              console.log("dfsChessBoard:"+(new Date().getTime()-startTime));

              return new dfsResult(0,1,4-depth);
            }

            let chessBoardScore = this.evaluate(chessBoardNext);
            if (isMax && (lastChessBoardScore <= chessBoardScore) || !isMax && (lastChessBoardScore >= chessBoardScore)){
              if (depth == 1){
                if (chessBoardScore < chessBoardScoreMin){
                  chessBoardScoreMin = chessBoardScore;
                }
              }else {
                let dfsResult = this.dfsChessBoard(depth-1,chessBoardNext,chessBoardScore,!isMax);
                if (dfsResult.existGameOver != 0){
                  return dfsResult;
                }
                if (dfsResult.historyScore < chessBoardScoreMin){
                  chessBoardScoreMin = dfsResult.historyScore;
                }
              }
            }

          }
        }
      }
      console.log("dfsChessBoard:"+(new Date().getTime()-startTime)+", chessBoardScoreMin" + chessBoardScoreMin);
      return new dfsResult(chessBoardScoreMin,0,0);
    }

    cleanWins(chessAI: ChessAIModule.ChessAI) {

    }

    /**
     * 是否周围有棋子
     * @param coordinate
     * @param chessBoard
     * @returns {boolean}
     */
    hasNeighbor(coordinate: Coordinate, chessBoard: number[][]): boolean{

      let startX = coordinate.x - 2;
      let endX = coordinate.x + 2;
      let startY = coordinate.y - 2;
      let endY = coordinate.y + 2;

      for(let i = startX; i <= endX; i++) {
        if(i < 0 || i > 14) {
          continue;
        }
        for(let j = startY; j <= endY; j++) {
          if(j < 0 || j > 14) {
            continue;
          }

          if(i == coordinate.x && j == coordinate.y) {
            continue;
          }
          if(chessBoard[i][j] != 0) {

            return true;
          }
        }
      }

      return false;
    }

    /**
     * 评估棋面得分, 局势评分也可以根据电脑所有子得分的相加-玩家所有子得分的相加
     * @param chessBoard
     * @returns {number}
     */
    evaluate(chessBoard: number[][]): number {
      let startTime = new Date().getTime();

      let comMaxScore = 0;
      let humMaxScore = 0;

      for(let i = 0; i < 15; i++) {
        for(let j = 0; j < 15; j++) {
          if(chessBoard[i][j] == 0 && this.hasNeighbor(new Coordinate(i,j), chessBoard)) {
            comMaxScore = Math.max(this.chessScore(new Coordinate(i,j), true, chessBoard), comMaxScore);
            humMaxScore = Math.max(this.chessScore(new Coordinate(i,j), false, chessBoard), humMaxScore);
          }
        }
      }
      console.log("evaluate:"+(new Date().getTime()-startTime)+", comMaxScore:"+comMaxScore+", humMaxScore:"+humMaxScore+", score:"+(comMaxScore - humMaxScore));

      return comMaxScore - humMaxScore;
    }

    /**
     * 是否游戏结束 0:未，1:玩家赢，2:电脑赢
     * @param chessBoard
     * @returns {number}
     */
    isGameOver(chessBoard: number[][]): number{


      let count = 0;

      // 纵向90°的五子判断
      for (let i = 0; i < 15; i++) {
        for (let j = 0; j < 11; j++) {
          count = 0;
          for (let k = 0; k < 5; k++) {
            if (chessBoard[i][j + k] == 0){
              count = 0;
              break;
            }else {
              count += chessBoard[i][j + k];
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
            if (chessBoard[j + k][i] == 0){
              count = 0;
              break;
            }else {
              count += chessBoard[j + k][i];
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
            if (chessBoard[i + k][j + k] == 0){
              count = 0;
              break;
            }else {
              count += chessBoard[i + k][j + k];
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
            if (chessBoard[i + k][j - k] == 0){
              count = 0;
              break;
            }else {
              count += chessBoard[i + k][j - k];
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
     * 计算在此下子的得分
     * @param coordinate
     * @param isCom
     * @param chessBoard
     */
    chessScore(coordinate: Coordinate, isCom: boolean, chessBoard: number[][]): number{

      const myDot = isCom ? 2 : 1;
      const againDot = isCom ? 1 : 2;
      let count = 0;
      let sum = 0;

      //横向
      for (let i = 0; i < 5; i++) {
        count = 0;
        for (let j = i - 4; j <= i; j++) {
          if (coordinate.x+j < 0 || coordinate.x+j > 14){
              continue;
          }
          if (chessBoard[coordinate.x+j][coordinate.y] == againDot){
              count = 0;
              break;
          }else if (chessBoard[coordinate.x+j][coordinate.y] == myDot){
              count++;
          }
        }
        sum += this.getScore(count);
      }

      //纵向
      for (let i = 0; i < 5; i++) {
        count = 0;
        for (let j = i - 4; j <= i; j++) {
          if (coordinate.y+j < 0 || coordinate.y+j > 14){
            continue;
          }
          if (chessBoard[coordinate.x][coordinate.y+j] == againDot){
            count = 0;
            break;
          }else if (chessBoard[coordinate.x][coordinate.y+j] == myDot){
            count++;
          }
        }
        sum += this.getScore(count);
      }

      // '/'向
      for (let i = 0; i < 5; i++) {
        count = 0;
        for (let j = i - 4; j <= i; j++) {
          if (coordinate.x+j < 0 || coordinate.x+j > 14 || coordinate.y+j < 0 || coordinate.y+j > 14){
            continue;
          }
          if (chessBoard[coordinate.x+j][coordinate.y+j] == againDot){
            count = 0;
            break;
          }else if (chessBoard[coordinate.x+j][coordinate.y+j] == myDot){
            count++;
          }
        }
        sum += this.getScore(count);
      }

      // '\'向
      for (let i = 0; i < 5; i++) {
        count = 0;
        for (let j = i - 4; j <= i; j++) {
          if (coordinate.x+j < 0 || coordinate.x+j > 14 || coordinate.y-j < 0 || coordinate.y-j > 14){
            continue;
          }
          if (chessBoard[coordinate.x+j][coordinate.y-j] == againDot){
            count = 0;
            break;
          }else if (chessBoard[coordinate.x+j][coordinate.y-j] == myDot){
            count++;
          }
        }
        sum += this.getScore(count);
      }

      return sum;
    }

    /**
     * 根据此赢法内的棋子数来返回分数
     * @param count
     */
    getScore(count: number): number{
      switch(count) {
        case 0: return Score.NONE;
        case 1: return Score.ONE;
        case 2: return Score.TWO;
        case 3: return Score.THREE;
        case 4: return Score.FOUR;
        default:return Score.NONE;
      }
    }

  }

  /**
   * 枚举分数类别
   */
  export enum Score{
    NONE = 0,
    ONE = 3,
    TWO = 10,
    THREE = 50,
    FOUR = 500
  }

  export class dfsResult {
    historyScore : number;
    //0:未，1:玩家赢，2:电脑赢
    existGameOver : number;
    //往下第几步会赢
    winStep : number;

    constructor(historyScore:number, existGameOver:number, winStep:number){
      this.historyScore = historyScore;
      this.existGameOver = existGameOver;
      this.winStep = winStep;
    }
  }

}

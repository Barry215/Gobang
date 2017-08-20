import {ChessAIModule} from "./ChessAIModule";
import ChessAI = ChessAIModule.ChessAI;
import {ChessBoardModule} from "./ChessBoardModule";
import Coordinate = ChessBoardModule.Coordinate;

export class ChessAIImpl3 implements ChessAI{

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


    // let winStep = 10;
    // let winCoordinate = []; //0:x,1:y


    let perfectCoordinate = []; //0:x,1:y
    let futureScoreMost = null;

    let evaluateScoreMost = null;

    let lastChessBoardScore = this.evaluate(chessBoard,false);

    //启发搜索
    for (let i = 0; i < 15; i++){
      for (let j = 0; j < 15; j++){
        if(chessBoard[i][j] == 0 && this.hasNeighbor2(i, j, chessBoard)) {
          let chessBoardNext = JSON.parse(JSON.stringify(chessBoard));
          chessBoardNext[i][j] = 2;

          let chessBoardScore = this.evaluate(chessBoardNext,true);
          if (evaluateScoreMost != null){
            if (chessBoardScore > evaluateScoreMost){
              evaluateScoreMost = chessBoardScore;
              perfectCoordinate[0] = i;
              perfectCoordinate[1] = j;
            }
          }else {
            evaluateScoreMost = chessBoardScore;
            perfectCoordinate[0] = i;
            perfectCoordinate[1] = j;
          }

        }
      }
    }

    let chessBoardBest = JSON.parse(JSON.stringify(chessBoard));
    chessBoardBest[perfectCoordinate[0]][perfectCoordinate[1]] = 2;

    futureScoreMost = this.dfsChessBoard(1,chessBoardBest,evaluateScoreMost,null,false);

    console.log("算出未来最佳值:"+futureScoreMost);

    for (let i = 0; i < 15; i++){
      for (let j = 0; j < 15; j++){

        console.log("进入大循环:"+i+","+j);

        if(chessBoard[i][j] == 0 && this.hasNeighbor2(i, j, chessBoard)) {

          console.log("第一层过滤:"+i+","+j);


          let chessBoardNext = JSON.parse(JSON.stringify(chessBoard));
          chessBoardNext[i][j] = 2;

          let chessBoardScore = this.evaluate(chessBoardNext,true);

          if (lastChessBoardScore == chessBoardScore){
              continue;
          }

          console.log("第二层过滤:"+i+","+j);


          //如果五子连珠
          if (this.isGameOver(chessBoardNext) == 2){
            return new Coordinate(i,j);
          }

          let futureScore = this.dfsChessBoard(1,chessBoardNext,chessBoardScore,futureScoreMost,false);

          if (futureScore == null){
            console.log("第三层过滤:"+i+","+j);

            continue;
          }

          if (futureScoreMost == null){
            futureScoreMost = futureScore;
            perfectCoordinate[0] = i;
            perfectCoordinate[1] = j;

            console.log("初始化futureScoreMost:"+futureScoreMost);

          }else {
            if (futureScore > futureScoreMost){
              futureScoreMost = futureScore;
              perfectCoordinate[0] = i;
              perfectCoordinate[1] = j;
              console.log("更新futureScoreMost:"+futureScoreMost);

            }
          }
        }
      }
    }
    console.log("computerStep:"+(new Date().getTime()-startTime));

    return new Coordinate(perfectCoordinate[0],perfectCoordinate[1]);

  }

  /**
   * Max层要选择子节点中最大的，Min层要选择子节点中最小的
   * @param depth 深度
   * @param chessBoard 上一层棋盘
   * @param lastChessBoardScore 上一层的棋面分
   * @param otherChessBoardScoreMost 兄弟们的棋面最佳分
   * @param isCom 是否在电脑层，电脑：min，玩家：max
   */
  dfsChessBoard(depth: number, chessBoard: number[][], lastChessBoardScore: number, otherChessBoardScoreMost: number, isCom: boolean): number{

    const myDot = isCom ? 2 : 1;
    let chessBoardScoreMost = null;
    let futureChessBoardScore = null;
    let evaluateScoreMost = null;
    let evaluateMaxCoordinate = [];

    //启发搜索
    if (depth != 1){
      for (let i = 0; i < 15; i++){
        for (let j = 0; j < 15; j++){
          if(chessBoard[i][j] == 0 && this.hasNeighbor2(i, j, chessBoard)) {
            let chessBoardNext = JSON.parse(JSON.stringify(chessBoard));
            chessBoardNext[i][j] = myDot;

            let chessBoardScore = this.evaluate(chessBoardNext, isCom);
            if (evaluateScoreMost != null){
              if (!isCom){
                if (chessBoardScore < evaluateScoreMost){
                  evaluateScoreMost = chessBoardScore;
                  evaluateMaxCoordinate[0] = i;
                  evaluateMaxCoordinate[1] = j;
                }
              }else {
                if (chessBoardScore > evaluateScoreMost){
                  evaluateScoreMost = chessBoardScore;
                  evaluateMaxCoordinate[0] = i;
                  evaluateMaxCoordinate[1] = j;
                }
              }
            }else {
              evaluateScoreMost = chessBoardScore;
              evaluateMaxCoordinate[0] = i;
              evaluateMaxCoordinate[1] = j;
            }

          }
        }
      }

      let chessBoardBest = JSON.parse(JSON.stringify(chessBoard));
      chessBoardBest[evaluateMaxCoordinate[0]][evaluateMaxCoordinate[1]] = myDot;

      chessBoardScoreMost = this.dfsChessBoard(depth-1,chessBoardBest,evaluateScoreMost,null,!isCom);
    }


    for (let i = 0; i < 15; i++){
      for (let j = 0; j < 15; j++){
        if(chessBoard[i][j] == 0 && this.hasNeighbor2(i, j, chessBoard)) {
          let chessBoardNext = JSON.parse(JSON.stringify(chessBoard));
          chessBoardNext[i][j] = myDot;

          let chessBoardScore = this.evaluate(chessBoardNext, isCom);
          if (lastChessBoardScore == chessBoardScore){
            continue;
          }

          if (depth != 1){
            futureChessBoardScore = this.dfsChessBoard(depth-1,chessBoardNext,chessBoardScore,chessBoardScoreMost,!isCom);
            //收到null，则跳过这个，若被剪枝，才返回null
            if (futureChessBoardScore == null){
                continue;
            }
          }

          //剪枝
          if (otherChessBoardScoreMost != null){
            if (!isCom){
              if (depth == 1){
                if (chessBoardScore < otherChessBoardScoreMost){
                    return null;
                }
              }else {
                if (futureChessBoardScore < otherChessBoardScoreMost){
                  return null;
                }
              }
            }else {
              if (futureChessBoardScore > otherChessBoardScoreMost){
                return null;
              }
            }
          }


          if (chessBoardScoreMost == null){
            if (depth == 1){
              chessBoardScoreMost = chessBoardScore;
            }else {
              chessBoardScoreMost = futureChessBoardScore;
            }
          }else {
            if (depth == 1){
              if (chessBoardScore < chessBoardScoreMost){
                chessBoardScoreMost = chessBoardScore;
              }
            }else {
              if (isCom){
                if (futureChessBoardScore > chessBoardScoreMost){
                  chessBoardScoreMost = futureChessBoardScore;
                }
              }else {
                if (futureChessBoardScore < chessBoardScoreMost){
                  chessBoardScoreMost = futureChessBoardScore;
                }
              }

            }
          }

        }
      }
    }

    return chessBoardScoreMost;
  }

  cleanWins(chessAI: ChessAIModule.ChessAI) {

  }

  /**
   * 是否周围2格内是否有棋子
   * @param x
   * @param y
   * @param chessBoard
   * @returns {boolean}
   */
  hasNeighbor1(x: number, y: number, chessBoard: number[][]): boolean{

    let startX = x - 2;
    let endX = x + 2;
    let startY = y - 2;
    let endY = y + 2;

    for(let i = startX; i <= endX; i++) {
      if(i < 0 || i > 14) {
        continue;
      }
      for(let j = startY; j <= endY; j++) {
        if(j < 0 || j > 14) {
          continue;
        }

        if(i == x && j == y) {
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
   * 判断周围2格内是否有棋子
   * @param x
   * @param y
   * @param chessBoard
   * @returns {boolean}
   */
  hasNeighbor2(x: number, y: number, chessBoard: number[][]): boolean{

    //最近的一层先搜索
    for(let i = x-1; i <= x+1; i++) {
      if(i < 0 || i > 14) {
        continue;
      }
      for(let j = y-1; j <= y+1; j++) {
        if(j < 0 || j > 14) {
          continue;
        }

        if(i == x && j == y) {
          continue;
        }

        if(chessBoard[i][j] != 0) {
          return true;
        }
      }
    }

    //最近水平的两格处
    for (let i = y-2; i <= y+2; i+=4){
      for (let j = x-2; j <= x+2; j++){

        if (i < 0 || i > 14 || j < 0 || j > 14){
          continue;
        }

        if (chessBoard[j][i] != 0){
          return true;
        }

      }
    }

    //最近垂直的两格处
    for (let i = x-2; i <= x+2; i+=4){
      for (let j = y-1; j <= y+1; j++){

        if (i < 0 || i > 14 || j < 0 || j > 14){
          continue;
        }

        if (chessBoard[i][j] != 0){
          return true;
        }

      }
    }

    return false;
  }


  /**
   * 评估棋面得分, 局势评分也可以根据电脑所有子得分的相加-玩家所有子得分的相加
   * @param chessBoard
   * @param isManNext
   * @returns {number}
   */
  evaluate(chessBoard: number[][], isManNext: boolean): number {

    let comMaxScore = 0;
    let humMaxScore = 0;

    for(let i = 0; i < 15; i++) {
      for(let j = 0; j < 15; j++) {
        if(chessBoard[i][j] == 0 && this.hasNeighbor2(i, j, chessBoard)) {
          let comScore = this.chessScore(i, j, true, chessBoard);
          if (comScore > comMaxScore){
            comMaxScore = comScore;
          }

          let humScore = this.chessScore(i, j, false, chessBoard);
          if (humScore > humMaxScore){
            humMaxScore = humScore;
          }
        }
      }
    }
    if (isManNext){
      return comMaxScore*12 - humMaxScore;
    }else {
      return comMaxScore - humMaxScore*12;
    }
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
   * @param x
   * @param y
   * @param isCom
   * @param chessBoard
   * @returns {number}
   */
  chessScore(x: number, y: number, isCom: boolean, chessBoard: number[][]): number{

    const myDot = isCom ? 2 : 1;
    const againDot = isCom ? 1 : 2;
    let count1 = 0;
    let count2 = 0;
    let sum = 0;

    //横向
    for (let i = 0; i < 5; i++) {
      count1 = 0;
      count2 = 0;
      for (let j = i - 4; j <= i; j++) {
        if (x+j < 0 || x+j > 14){
          continue;
        }
        if (chessBoard[x+j][y] == againDot){
          count1 = 0;
          count2++;
        }else if (chessBoard[x+j][y] == myDot){
          count2 = 0;
          count1++;
        }
      }
      sum += this.getScore1(count1);
      sum += this.getScore2(count2);
    }

    //纵向
    for (let i = 0; i < 5; i++) {
      count1 = 0;
      count2 = 0;
      for (let j = i - 4; j <= i; j++) {
        if (y+j < 0 || y+j > 14){
          continue;
        }
        if (chessBoard[x][y+j] == againDot){
          count1 = 0;
          count2++;
        }else if (chessBoard[x][y+j] == myDot){
          count2 = 0;
          count1++;
        }
      }
      sum += this.getScore1(count1);
      sum += this.getScore2(count2);
    }

    // '/'向
    for (let i = 0; i < 5; i++) {
      count1 = 0;
      count2 = 0;
      for (let j = i - 4; j <= i; j++) {
        if (x+j < 0 || x+j > 14 || y+j < 0 || y+j > 14){
          continue;
        }
        if (chessBoard[x+j][y+j] == againDot){
          count1 = 0;
          count2++;
        }else if (chessBoard[x+j][y+j] == myDot){
          count2 = 0;
          count1++;
        }
      }
      sum += this.getScore1(count1);
      sum += this.getScore2(count2);
    }

    // '\'向
    for (let i = 0; i < 5; i++) {
      count1 = 0;
      count2 = 0;
      for (let j = i - 4; j <= i; j++) {
        if (x+j < 0 || x+j > 14 || y-j < 0 || y-j > 14){
          continue;
        }
        if (chessBoard[x+j][y-j] == againDot){
          count1 = 0;
          count2++;
        }else if (chessBoard[x+j][y-j] == myDot){
          count2 = 0;
          count1++;
        }
      }
      sum += this.getScore1(count1);
      sum += this.getScore2(count2);
    }

    return sum;
  }

  /**
   * 根据此赢法内的棋子数来返回分数
   * 电脑版
   * @param count
   */
  getScore1(count: number): number{
    switch(count) {
      case 0: return 0;
      case 1: return 1;
      case 2: return 10;
      case 3: return 100;
      case 4: return 1000;
      default:return 0;
    }
  }

  /**
   * 玩家版
   * @param count
   * @returns {number}
   */
  getScore2(count: number): number{
    switch(count) {
      case 0: return 0;
      case 1: return 1;
      case 2: return 5;
      case 3: return 50;
      case 4: return 500;
      default:return 0;
    }
  }
}

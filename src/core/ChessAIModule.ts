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

}

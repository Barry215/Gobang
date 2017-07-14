import * as Vue from 'vue';
import './gobang.css'
import {ChessBoardModule} from "../../core/ChessBoardModule";
import Chess = ChessBoardModule.Chess;
import {ChessAIModule} from "../../core/ChessAIModule";
import {ChessAIImpl1} from "../../core/ChessAIImpl1";
import {ChessAIImpl2} from "../../core/ChessAIImpl2";

export default Vue.extend({
  template: require('./gobang.html'),
  data(){
    return {
      isBlack : false,
      isFirst : false,
      btn_able : false,
      yourTurn : false,
      gameOver : false,
      modal_show: false,
      button_text: "开始",
      whichComputer : false
    }
  },
  computed : {
    chess: function () {
      let canvas = <HTMLCanvasElement>document.getElementById('canvas');
      return new Chess(canvas);
    },
    chessBoard: function () {
      let chessBoard = [];
      for (let i = 0; i < 15; i++) {
        chessBoard[i] = [];
        for (let j = 0; j < 15; j++) {
          chessBoard[i][j] = 0;
        }
      }
      return chessBoard;
    },
    chessAIImpl: function () {
      let t: any = this;
      if (!t.whichComputer){
        return new ChessAIImpl1();
      }else {
        return new ChessAIImpl2();
      }
    }
  },
  methods: {
    ok () {
      let t: any = this;
      t.btn_able = true;
      if (t.button_text == "再来一局"){
        t.chess.gameAgain(t);
      }
      t.yourTurn = t.isFirst;
      if (!t.isFirst){
        t.chess.computerFirstStep(t);
      }
      t.chess.initClick(t);
    }
  },
  mounted(){
    let t: any = this;
    t.chess.resize(450, 450);
    t.chess.initBoard();
  }

})

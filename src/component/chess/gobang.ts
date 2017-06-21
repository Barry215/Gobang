import * as Vue from 'vue';
import {ChessBoardModule} from "../../core/ChessBoardModule";
import Chess = ChessBoardModule.Chess;

export default Vue.extend({
  template: require('./gobang.html'),
  data(){
    return {
      isBlack : true,
      isFirst : true,
      btn_show : true,
      modal_show: false
    }
  },
  methods: {
    ok () {
      let t: any = this;
      t.btn_show = false;
    }
  },
  mounted(){
    let t: any = this;

    let canvas = <HTMLCanvasElement>document.getElementById('canvas');

    let chessBoard = new Chess(canvas);

    chessBoard.initBoard();
    chessBoard.startChess(t.isBlack,t.isFirst);
    chessBoard.initClick();

  }

})

import * as Vue from 'vue';
import * as io from 'socket.io-client';
import './player.css'
import {PlayChess} from "../../core/PlayBoardModule";

export default Vue.extend({

  template: require('./player.html'),
  data(){
    return {
      gameId : "",
      againstId : "",
      inviteId : "",
      inviteName : "",
      nick : "",
      onlineList : [],
      loading: false,
      modal_show2 : false,
      modal_show3 : true,
      modal_show4 : false,
      gameStart : false,
      isInviteUser : false,
      button_start : "开始",
      btn_start_able : false,
      isAfter : true,
      myTurn : false,
      gameOver : false,
      nextBlack : true
    }
  },
  computed : {
    socket : function () {
      return io.connect('http://localhost:3000');
    },
    playChess: function () {
      let canvas = <HTMLCanvasElement>document.getElementById('canvasPlay');
      return new PlayChess(canvas);
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
    }
  },
  methods: {
    inviteGame() {
      let t: any = this;
      if (t.againstId != ""){
        t.loading = true;
        t.socket.emit('inviteGame', t.againstId);
      }else {
          alert("您还未选择挑战的人呢!");
      }

    },
    btn_ok () {
      let t: any = this;
      t.socket.emit('acceptGame', t.inviteId);
      t.isInviteUser = false;
      t.gameStart = true;

      t.playChess.resize(450, 450);
      t.playChess.initBoard();
      t.playChess.initClick(t);
      //对方接受了邀请playChess
    },
    btn_cancel () {
      let t: any = this;
      t.socket.emit('refuseGame', t.inviteId);
    },
    emitNick () {
      let t: any = this;
      if (t.nick != ""){
        t.socket.emit('initNick', t.nick);
      }else {
        alert("昵称不能为空");
      }
    },
    modifyNick () {
      let t: any = this;
      t.modal_show3 = true;
    },
    btn_ok_startGame (){
      let t: any = this;
      t.btn_start_able = true;
      t.myTurn = !t.isAfter;
      t.nextBlack = !t.isAfter;

      t.socket.emit('gameTurn', {againstId : t.againstId,isAfter : t.isAfter});
    }
  },
  mounted(){
    // 可以这样增加一个属性，也不需要在data里初始化
    // this.socket = io.connect('http://localhost:3000');
    let t : any = this;
    t.socket.on('connect', () => {
      t.gameId = t.socket.id;
    });

    t.socket.on('receiveGame', function (result) {
      t.inviteId = result.inviteId;
      t.againstId = result.inviteId;
      t.inviteName = result.inviteName;
      t.modal_show2 = true;
    });

    t.socket.on('inviteResult', function (result) {
      t.loading = false;
      if (result){
        t.gameStart = true;
        t.isInviteUser = true;

        t.playChess.resize(450, 450);
        t.playChess.initBoard();
        t.playChess.initClick(t);


        alert("对方接受了邀请！")
      }else {
          alert("对方并不想理你，并丢给你一条狗🐶")
      }
    });

    t.socket.on('initNickResult', function (result) {
      if (result){
        t.modal_show3 = false;
      }else {
        t.nick = "";
        alert("此昵称已经有人用了");
      }
    });

    t.socket.on('refreshOnlineList', function (onlineList) {
      console.log("onlineList:" + onlineList);
      t.onlineList = JSON.parse(onlineList);
    });

    t.socket.on('isAfter', function (isAfter) {
      t.isAfter = isAfter;
      t.myTurn = !isAfter;
      t.nextBlack = !isAfter;
    });

    t.socket.on('pullChessBoard', function (data) {
      const newChessBoard = JSON.parse(data.chessBoard);
      t.myTurn = true;
      t.nextBlack = data.nextBlack;
      t.playChess.drawAllChessPiece(t,newChessBoard);

    });

    t.socket.on('news', function (data) {
      t.socket.emit('my other event', "great");
    });
  }

})

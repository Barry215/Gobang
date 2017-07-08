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
      challengeId : "",
      inviteId : "",
      inviteName : "",
      nick : "",
      onlineList : [],
      loading: false,
      modal_show2 : false,
      modal_show3 : true,
      modal_show4 : false,
      modal_show5 : false,
      modal_show6 : false,
      modal_show7 : false,
      modal_show8 : false,
      gameStart : false,
      isInviteUser : false,
      button_start : "开始",
      btn_start_able : false,
      invite_able : true,
      isAfter : true,
      myTurn : false,
      gameOver : false,
      nextBlack : true,
      turnMsgShow : false,
      isGameWin : true,
      chessBoardList : [],
      oldX : 0,
      oldY : 0,
      forgiveAble : true,
      forgiveResponse : true
    }
  },
  computed : {
    socket : function () {
      // return io.connect('http://www.maijinta.cn:3001');
      return io.connect('http://localhost:3001');
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
    notice_success (msg) {
      let t: any = this;
      t.$Message.success(msg);
    },
    notice_warning (msg) {
      let t: any = this;
      t.$Message.warning(msg);
    },
    inviteGame() {
      let t: any = this;
      if (t.challengeId != ""){
        t.loading = true;
        t.socket.emit('inviteGame', t.challengeId);
      }else {
          t.notice_warning('您还未选择挑战的人呢！');
      }

    },
    btn_ok () {
      let t: any = this;
      t.socket.emit('acceptGame', t.inviteId);
    },
    btn_cancel () {
      let t: any = this;
      t.socket.emit('refuseGame', t.inviteId);
    },
    emitNick () {
      let t: any = this;
      if (t.nick.trim() != ""){
        t.socket.emit('initNick', t.nick);
      }else {
        t.notice_warning('昵称不能为空');
      }
    },
    modifyNick () {
      let t: any = this;
      t.modal_show3 = true;
    },
    btn_ok_startGame (){
      let t: any = this;
      t.btn_start_able = true;
      t.invite_able = false;
      t.myTurn = !t.isAfter;
      t.nextBlack = !t.isAfter;
      t.turnMsgShow = true;
      if (t.gameOver){
        t.playChess.gameAgain(t);
      }else {
        t.playChess.initClick(t);
      }

      t.socket.emit('gameTurn', {againstId : t.againstId,isAfter : t.isAfter});
    },
    btn_ok_forgiveChess (){
      let t: any = this;
      t.socket.emit('forgiveChessRequest', t.againstId);
    },
    btn_agree_forgiveChess (){
      let t: any = this;
      t.playChess.forgiveChess(t,false);
      if (t.gameId != t.againstId){
        t.socket.emit('agreeForgiveChess', t.againstId);
      }else {
        t.myTurn = true;
      }
    },
    btn_reject_forgiveChess (){
      let t: any = this;
      t.socket.emit('rejectForgiveChess', t.againstId);
    },
    btn_surrender (){
      let t: any = this;
      t.socket.emit('surrenderRequest', t.againstId);
      t.playChess.handleSurrender(t,true);
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
      t.inviteName = result.inviteName;
      t.modal_show2 = true;
    });

    t.socket.on('inviteResult', function (data) {
      if (data.result){
        if (t.challengeId == data.challengeId && t.loading){
          t.gameStart = true;
          t.isInviteUser = true;
          t.againstId = t.challengeId;

          t.notice_success('对方接受了邀请！');
          t.socket.emit('confirmAccept', {challengeId: t.challengeId, result: true});

          t.playChess.resize(450, 450);
          t.playChess.initBoard();
        }else {
          t.socket.emit('confirmAccept', {challengeId: t.challengeId, result: false});
        }
      }else {
        if (t.challengeId == data.challengeId && t.loading){
          t.notice_warning('对方并不想理你，并丢给你一条狗🐶');
        }
      }
      t.loading = false;

    });

    t.socket.on('initNickResult', function (result) {
      if (result){
        t.modal_show3 = false;
      }else {
        t.nick = "";
        t.notice_warning('此昵称已经有人用了');
      }
    });

    t.socket.on('refreshOnlineList', function (onlineList) {
      t.onlineList = JSON.parse(onlineList);
    });

    t.socket.on('isAfter', function (isAfter) {
      t.isAfter = isAfter;
      t.myTurn = !isAfter;
      t.nextBlack = !isAfter;
      t.turnMsgShow = true;
      t.invite_able = false;
      if (t.gameOver){
        t.playChess.gameAgain(t);
      }else {
        t.playChess.initClick(t);
      }

    });

    t.socket.on('pullChessBoard', function (data) {
      const newChessBoard = JSON.parse(data.chessBoard);
      t.myTurn = true;
      t.nextBlack = data.nextBlack;
      t.playChess.drawAllChessPiece(t,newChessBoard);
      t.playChess.handleGameOver(t);
    });

    t.socket.on('runAway', function (socketId) {
      if (socketId == t.againstId){
        t.notice_warning('您的对手逃跑了！');
        t.socket.emit('gameOver');
        t.forgiveAble = true;

        setTimeout(new function () {
          t.gameOver = true;
          t.turnMsgShow = false;
          t.btn_start_able = false;
          t.invite_able = true;
          t.gameStart = false;

        },1000);

      }
    });

    t.socket.on('offline', function (againstId) {
      if (t.againstId == againstId){
        t.notice_warning('您的对手离开了！');
        t.gameStart = false;
        t.btn_start_able = false;
        t.invite_able = true;
        t.turnMsgShow = false;

      }
    });

    t.socket.on('forgiveChessRequest', function () {
      t.modal_show7 = true;
    });

    t.socket.on('forgiveChessResult', function (result) {
      if (result){
        t.notice_success("对方同意您悔棋");
        t.playChess.forgiveChess(t,true);
      }else {
        t.notice_warning("对方不同意您悔棋");

      }
    });

    t.socket.on('confirmResult', function (result) {
      if (result){
        t.isInviteUser = false;
        t.gameStart = true;
        t.againstId = t.inviteId;

        t.playChess.resize(450, 450);
        t.playChess.initBoard();


        t.notice_success("对局已经准备好了");
      }else {
        t.notice_warning("对方已经取消了邀请");
      }
    });

    t.socket.on('acceptSurrender', function () {
      t.playChess.handleSurrender(t,false);
    });

    t.socket.on('news', function (data) {
      t.socket.emit('my other event', "great");
    });
  }

})

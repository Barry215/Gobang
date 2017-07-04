import * as Vue from 'vue';
import * as io from 'socket.io-client';
import './player.css'

export default Vue.extend({

  template: require('./player.html'),
  data(){
    return {
      gameId : "",
      againstName : "",
      inviteId : "",
      nick : "",
      onlineList : [],
      loading: false,
      modal_show2 : false,
      modal_show3 : true
    }
  },
  computed : {
    socket : function () {
      return io.connect('http://localhost:3000');
    }
  },
  methods: {
    inviteGame() {
      let t: any = this;
      t.loading = true;
      t.socket.emit('inviteGame', t.againstId);
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
    getOnlineList () {
      let t: any = this;
      t.socket.emit('getOnlineList');
    }
  },
  mounted(){
    // 可以这样增加一个属性，也不需要在data里初始化
    // this.socket = io.connect('http://localhost:3000');
    let t : any = this;
    t.socket.on('connect', () => {
      t.gameId = t.socket.id;
    });

    t.socket.on('receiveGame', function (inviteId) {
      t.inviteId = inviteId;
      t.modal_show2 = true;
    });

    t.socket.on('inviteResult', function (result) {
      t.loading = false;
      if (result){
        alert("游戏开始！")
      }else {
          alert("对方并不想理你，并丢给你一条狗🐶")
      }
    });

    t.socket.on('initNickResult', function (result) {
      if (result.status){
        alert(result.msg);
        t.modal_show3 = false;
      }else {
        t.nick = "";
        alert(result.msg);
      }
    });

    t.socket.on('refreshOnlineList', function (onlineList) {
      console.log("onlineList:" + onlineList);
      t.onlineList = JSON.parse(onlineList);
    });

    t.socket.on('news', function (data) {
      t.socket.emit('my other event', "great");
    });
  }

})

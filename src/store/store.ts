import * as Vue from 'vue';
import * as Vuex from 'vuex';
import * as io from 'socket.io-client';

Vue.use(Vuex);

// import ChessStoreModule from './modules/ChessStoreModule';

export default new Vuex.Store({
  state: {

  },
  mutations: {

  },
  actions: {

  },
  getters: {
    socket2 : function () {
      return io.connect('http://localhost:3000');
    }
  }
  // modules:{
  //   a : ChessStoreModule
  // }
})

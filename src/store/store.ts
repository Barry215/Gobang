import * as Vue from 'vue';
import * as Vuex from 'vuex';
Vue.use(Vuex);

import ChessStoreModule from './modules/ChessStoreModule';

export default new Vuex.Store({
  modules:{
    ChessStoreModule
  }
})

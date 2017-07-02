import * as Vue from 'vue';
import './player.css'

export default Vue.extend({
  template: require('./player.html'),
  data(){
    return {
      gameId : 512,
      againstId : 623,
      loading: false,
      modal_show2 : false
    }
  },
  computed : {

  },
  methods: {
    inviteGame() {
      let t: any = this;
      t.loading = true;
      t.modal_show2 = true;
    },
    ok () {
      let t: any = this;

    },
    cancel () {
      let t: any = this;

    }
  },
  mounted(){

  }

})

import * as Vue from 'vue';
import './index.css'

export default Vue.extend({
  template: require('./index.html'),
  data(){
    return {

    }
  },
  methods: {
    routerGo1 () {
      this.$router.push('/gobang');
    },
    routerGo2 () {
      this.$router.push('/player');
    }
  },
  mounted(){

  }

})

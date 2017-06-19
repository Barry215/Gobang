import * as Vue from 'vue';
import {NavigationModule} from "../../controller/NavigationModule";
import Location = NavigationModule.Location;
import {GraphicsModule} from "../../core/GraphicsModule";
import GraphicsCanvasImpl = GraphicsModule.GraphicsCanvasImpl;
import {GraphicsModelModule} from "../../core/GraphicsModelModule";
import OneKey = GraphicsModelModule.OneKey;
import Coordinate = GraphicsModelModule.Coordinate;
import Circle = GraphicsModelModule.Circle;
/**
 * @description 类型1
 */
export default Vue.extend({
  template: require('./type1.html'),
  data(){

    return {
    }
  },
  watch: {
    $route: {
      handler(){
        Location.reload();
      }
    }
  },
  mounted(){
    let canvas = <HTMLCanvasElement>document.getElementById('canvas');
    let test = new GraphicsCanvasImpl(canvas);
    test.resize(800,800);
    test.drawOneKey(new OneKey(new Coordinate(50,50),'T',20));
    test.drawOneKey(new OneKey(new Coordinate(100,50),'E',20));
    test.drawOneKey(new OneKey(new Coordinate(150,50),'S',20));
    test.drawOneKey(new OneKey(new Coordinate(200,50),'T',20));
    test.drawOneKey(new OneKey(new Coordinate(250,50),'!',20));
    test.drawCircle(new Circle(new Coordinate(500,500),100,'圆形'))
  }
})

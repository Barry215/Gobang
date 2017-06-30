
import gobang from './component/chess/gobang'
import index from './component/index/index'
import player from './component/player/player'

const routes = [
  {
    path: '/',
    component: index
  },
  {
    path: '/gobang',
    component: gobang
  },
  {
    path: '/player',
    component: player
  }
];

export default routes;

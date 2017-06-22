import type1 from './component/type1/type1'
import gobang1 from './component/canvas/gobang1'
import gobang from './component/chess/gobang'

const routes = [
  {
    path: '/',
    component: gobang
  },
  {
    path: '/gobang',
    component: gobang1
  },
  {
    path: '/type1',
    component: type1
  },
];

export default routes;

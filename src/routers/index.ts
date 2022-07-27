import common from './common';
import { lazy } from 'react';

// 仅在微信端使用的活动，路由放到wxRouters进行统一处理-路径增加 /wxActivity 前缀
const wxRouters: NSRouter.IRouterItem[] = [
  {
    path: '/accidentInfoRecord',
    component: lazy(() => import('@/pages/accidentInfoRecord')),
  },
];

const routers = [...common, ...wxRouters];

export default routers;

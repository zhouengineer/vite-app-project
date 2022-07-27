import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
// import { StoreContext } from 'redux-react-hook';
// import store from '@/store';
import App from './app';
import '@/utils/setup.ts';
import '@/assets/css/reset.less';
import '@/assets/css/base.less';
import '@/assets/css/animate.less';
import '@/assets/css/iconfont.less';
ReactDOM.render(
  <BrowserRouter basename="/admin-app">
    <App />
  </BrowserRouter>,
  document.getElementById('root')
);

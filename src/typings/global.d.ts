/* eslint-disable no-undef */
import { RouteComponentProps } from 'react-router';

// 声明全局变量
declare global {
  // 获取interface/type的键值联合类型集合
  type ValueOf<T> = T[keyof T];
  // 获取interface/type的键名联合类型集合
  type KeyOf<T> = keyof T;
  // react-router history类型定义
  type history = RouteComponentProps['history'];
  interface Window {
    $log: any;
    $error: any;
    // 跳转民生银行App界面用到的变量
    SysClientJs: any;
    webkit: any;
    _mevents: any;
  }

  interface Document {
    attachEvent(event: string, listener: EventListener): boolean;
    detachEvent(event: string, listener: EventListener): void;
  }

  namespace WeixinJSBridge {
    function call(apiName: string): void;
  }

  namespace wx {
    function error(config: unknown): void;
    function config(config: unknown): void;
    function checkJsApi(config: unknown): void;
    function ready(config: unknown): void;
    function agentConfig(config: unknown): void;
    function onMenuShareTimeline(config: unknown): void;
    function onMenuShareAppMessage(config: unknown): void;
    function updateAppMessageShareData(config: unknown): void;
    function updateTimelineShareData(config: unknown): void;
    function invoke(apiName: string, config: object, cb: unknown): void;
    function hideMenuItems(config: unknown): void;
    function showMenuItems(config: unknown): void;
    function hideOptionMenu(): void;
    function getLocation(config: unknown): void;
  }
}

// 消除div上书写name属性报错的问题
declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    // 扩展 React's HTMLAttributes
    name?: string;
  }
}
// esModule要求必须有导出项,全局声明不必导出，这样写是为了避免编译器提示警告
export {};

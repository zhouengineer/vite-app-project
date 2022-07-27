import React, { useState, useEffect, Suspense } from 'react';
import { Route, withRouter } from 'react-router-dom';
import Routers from '@/routers';
import globalData from '@/config/globalData';
import keyDict from '@/config/keyDict';
import ajax from '@/utils/ajax';
import { Toast } from 'antd-mobile';
import md5 from 'md5';
import { getUrlQueryString, searchToJson, getCookie, getLocalStorage, setLocalStorage } from '@/utils';
import './app.less';

function App(props: any): React.FC<any> | any {
  interface EntrySearchObject {
    currentCorpId?: string;
    agentId?: string;
    appId?: string;
  }
  const search: string = decodeURIComponent(window.location.search);
  let entrySearchObj: EntrySearchObject = searchToJson(getLocalStorage(keyDict.entrySearch) || search); // 页面参数

  globalData.currentCorpId =
    process.env.NODE_ENV === 'development'
      ? (import.meta.env.VITE_TEST_CORP_ID as string)
      : getUrlQueryString(search, 'currentCorpId');

  // states
  const [showDom, setShowDom] = useState<boolean>(false); // 是否显示页面元素

  useEffect(() => {
    // 1 是需要登录，非1是不需要登录
    const isDebugMode = getUrlQueryString(search, 'isLogin') === '1';
    isDebugMode ? realLogin() : testLoginH5();
  }, []);

  // 真实登录
  async function realLogin() {
    const copyUrlParams: string = decodeURIComponent(window.location.search);
    const { authType, currentCorpId: corpId, activityId, param } = searchToJson(copyUrlParams);
    setShowDom(true);
    // 登录
    // sassLogin(copyUrlParams);
  }

  async function sassLogin(copyUrlParams: string) {
    // 存储自建应用主页的url查询参数,不含code,code只能使用一次，5分钟之内不用会过期,所以没有必要存
    saveUrlParams(copyUrlParams);

    const caizhiH5Key: string = getCookie('caizhi_h5_key');
    const isCurrentCorp: boolean =
      md5(entrySearchObj.currentCorpId as string) === decodeURIComponent(caizhiH5Key).split(';')[1];

    // 需要访问者重新登录的三种情况:
    // 1.没有cookie，说明没有登录过
    // 2.访问者登录的不是当前企业，需要重新登录
    // 3.存储的访问者Id丢失,需要重新登录
    if (caizhiH5Key && isCurrentCorp && getLocalStorage(keyDict.visitorId) !== null) {
      // 获取配置信息
      setShowDom(true);
    } else {
      console.log('111');
    }
  }

  // 不需要登录登录
  async function testLoginH5() {
    setShowDom(true);
  }

  // 保存url参数
  function saveUrlParams(urlParams: string) {
    let copyUrlParams = urlParams;
    if (copyUrlParams.includes('code')) {
      copyUrlParams = copyUrlParams.replace(`&code=${getUrlQueryString(copyUrlParams, 'code')}`, '');
    }
    // 存储页面查询参数
    setLocalStorage(keyDict.entrySearch, copyUrlParams);
    entrySearchObj = searchToJson(copyUrlParams);
  }

  return (
    <div className="app">
      <Suspense fallback={<div />}>
        {showDom &&
          Routers.map((route: any) => (
            <Route exact path={route.path} key={route.path}>
              <route.component {...props} />
            </Route>
          ))}
      </Suspense>
    </div>
  );
}

export default withRouter(App);

import axios, { AxiosRequestConfig, Method } from 'axios';
import { Toast } from 'antd-mobile';
// @ts-ignore
// import { sm4, md5 } from '@tenwit/tenone-crypto';
import globalData from '@/config/globalData';
import apiConfig from '@/apis';
import { searchToJson, getCookie, clearCookieByKey, getSession, setSession, delSession } from '@/utils';

import 'antd-mobile/es/toast/style'; // 加载 CSS
console.log('apiConfig', apiConfig);

let loadingCount = 0; // 统计需要loading的请求，还没返回的数量

// ajax请求入参类型
interface IAjaxParams {
  api: string;
  params?: ReqParams;
  isError?: boolean;
  isLoading?: boolean;
  loadingMsg?: string;
}
interface ReqParams {
  [key: string]: any;
}

// 请求返回类型
interface IResDataProps {
  ret: number;
  retdata: any;
  retmsg: string;
}
const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};
/**
 * api: ajax请求路径 由模块名+接口key组成,以.连接,举例:'common.getTicket'
 * params: ajax请求体
 * isError：是否显示默认错误信息
 * isLoading：是否显示默认loading
 */
export default function ajax({
  api,
  params = {},
  isError = true,
  isLoading = false,
  loadingMsg = '加载中...',
}: IAjaxParams): IResDataProps | any {
  const apiArr = api.split('.');
  const apiModule = apiArr[0];
  const apiKey = apiArr[1];
  const { url = '', method = 'POST', isJson = true, timeout } = apiConfig[apiModule][apiKey];
  const headers = {
    'Content-Type': isJson ? 'application/json' : 'multipart/form-data',
    'X-TenWit-CorpId': globalData.currentCorpId || '',
  };

  return new Promise(async (resolve, reject) => {
    if (isLoading) {
      loadingCount++;
      loadingCount === 1 && Toast.loading(loadingMsg, 0); // Toast.loading需要加loadingCount === 1
    }
    const reqMethod: Method = method as Method;
    const obj: AxiosRequestConfig = {
      url,
      headers,
      method: reqMethod,
    };

    // 群发确认页面添加超时配置
    if (timeout) {
      obj.timeout = timeout;
    }

    if (method === 'GET') {
      obj.params = params;
    } else if (!isJson) {
      const formData = new FormData();
      Object.keys(params).forEach((key) => {
        formData.append(key, params[key]);
      });
      obj.data = formData;
    } else {
      obj.data = params;
    }

    try {
      const { headers, status, statusText, data } = await axios(obj);
      if (status === 200) {
        // encrypt<string>，标识加密方式，1：国密sm4
        if (headers.encrypt === '1') {
          // SM4解密
          try {
            // // 密钥，要求：将 caizhi_h5_key 用 md5 加密后的32位字符串，全16进制
            // const key = md5(getCookie('caizhi_h5_key') || '');

            // // 解密后的数据
            // const dataStr = sm4.decrypt(data.retdata, key);
            // data.retdata = JSON.parse(dataStr);
            console.log('解密后的数据', data);
          } catch (err) {
            console.log('解密失败', err);
          }
        }

        handleNetSuccStatus({ data, resolve, reject, isError });
      } else {
        isError && showError(statusText);
        reject(new Error(statusText ? `${JSON.stringify(statusText)}` : '未知错误 [from axios 拦截器]'));
      }
    } catch (e) {
      isError && showError();
      reject(e);
    } finally {
      if (isLoading) {
        loadingCount--;
        loadingCount === 0 && Toast.hide();
      }
    }
  });
}

interface INetSuccProps {
  data: { [key: string]: any };
  resolve: (value: unknown) => void;
  reject: (err: unknown) => void;
  isError: boolean;
}
// 处理请求成功状态
function handleNetSuccStatus({ data, resolve, reject, isError }: INetSuccProps) {
  const { ret, retmsg } = data;
  // ===========民生银行模拟登陆接口不标准=========
  if (ret === undefined) return resolve(data);
  switch (ret) {
    case 0:
    case -58:
      resolve(data);
      break;
    case 1000001:
      // sass登录失效
      clearCookieByKey('caizhi_h5_key');
      if (getSession('againAuthority')) {
        delSession('againAuthority');
        isError && showError(retmsg);
        reject(new Error(data ? `${JSON.stringify(data)}` : '未知错误 [from axios 拦截器]'));
        return false;
      }
      setSession('againAuthority', 1);
      window.location.reload();

      break;
    case 1010086:
    case 1010087:
      reject(new Error(data ? `${JSON.stringify(data)}` : '未知错误 [from axios 拦截器]'));
      break;
    case 9000001:
      // 该篇早报删除的code
      resolve(data);
      break;
    default:
      isError && showError(retmsg);
      reject(new Error(data ? `${JSON.stringify(data)}` : '未知错误 [from axios 拦截器]'));
  }
}

function showError(msg = '服务异常，请稍后重试') {
  setTimeout(() => {
    // 关闭页面loading
    Toast.info(msg);
  }, 600);
}

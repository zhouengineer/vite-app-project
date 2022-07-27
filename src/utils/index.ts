import keyDict from '@/config/keyDict';
import globalData from '@/config/globalData';
import CryptoJS from 'crypto-js';

// 判断手机操作系统
export const mobileSys = /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent) ? 'IOS' : 'Android';

/**
 * 图片预加载
 * @param arr 图片地址集合
 */
export const preLoadImg = (arr: string[]): void => {
  arr.forEach((src) => {
    let img = new Image();
    img.src = src;
  });
};
/**
 * 将YYYY-MM-DD hh:mm:ss字符串的时间转换成时间戳
 * @param time YYYY-MM-DD hh:mm:ss格式的字符串
 * @returns 转换之后的时间戳
 */
export const getTimeStamp = (time: string): number => {
  // 为了兼容IOS下的时间格式
  if (time) {
    time = time.replace(/-/g, '/');
    return new Date(time).getTime();
  } else {
    return 0;
  }
};

// 判断是pc端还是移动端
export const isPC = !/Android|webOS|iPhone|iPod|BlackBerry|SymbianOS|Windows Phone/i.test(navigator.userAgent);

// 判断当前是微信环境还是企业微信环境
export function getEnv(): string {
  const ua = window.navigator.userAgent.toLowerCase();
  if (ua.match(/MicroMessenger/i) && ua.match(/wxwork/i)) {
    // 企业微信
    return 'qywx';
  } else if (ua.match(/micromessenger/i)) {
    // 微信
    return 'wx';
  } else {
    return '';
  }
}

// 微信环境标识
export enum wechatEnv {
  EnterpriseWeChat = 'qywx',
  PersonalWeChat = 'wx',
}

// 获取cookie
export function getCookie(name: string): string {
  const strCookie = document.cookie;
  const arrCookie = strCookie.split('; ');
  for (const cookie of arrCookie) {
    const cookieVal = cookie.split('=');
    if (cookieVal[0] === name) {
      return cookieVal[1];
    }
  }
  return '';
}

// time秒 默认30天
export function setCookie(name: string, value: string, time?: number): void {
  time = time || 30 * 24 * 3600;
  const exp = new Date();
  exp.setTime(exp.getTime() + time * 1000);
  // 注意 这里一定要写path=/ 让cookie写在根路径/下面(也就是域名下)
  // 如果不指定path，由于测试服的访问地址是https://test.qtrade.com.cn/xx_admin
  // 在setCookie 'xx_user'的时path默认是xx_admin
  // 之后clearCookieByKey 'xx_key'就只能清除xx_admin下的xx_key，而cookie xx_key是后端写到前端的，path是 /
  document.cookie = name + '=' + value + ';expires=' + exp.toUTCString() + ';path=/';
}

// 清除cookie
export function clearCookieByKey(name: string): void {
  setCookie(name, '', -1);
}

// 获取sessionStorage
export function getSession(name: string): string | null {
  return sessionStorage.getItem(name);
}

// 设置sessionStorage
export function setSession(name: string, value: any): void {
  sessionStorage.setItem(name, value);
}

//  删除sessionStorage
export function delSession(name: string): void {
  sessionStorage.removeItem(name);
}

// 获取localStorage
export function getLocalStorage(name: string): string | null {
  return localStorage.getItem(name);
}

// 设置localStorage
export function setLocalStorage(name: string, value: any): void {
  localStorage.setItem(name, value);
}

// 删除localStorage
export function delLocalStorage(name: string): void {
  localStorage.removeItem(name);
}
/**
 * 设置分享的url
 * @param shareObj 分享参数
 * @returns 更新了staffId,currentCorpId,agentId字段之后的url
 */
export function setShareUrl(shareObj: IObjAny) {
  // 分享参数,staffId取自页面传入的shareObj对象,而不是url上的staffId
  const { linkUrl = window.location.href, staffId } = shareObj;
  // 从url上获取分享所需的  currentCorpId  agentId
  // 为什么要从本地存储取corpId和agentId,应该从url上取才对
  // const searchObj = searchToJson(localStorage.getItem(keyDict.entrySearch) || window.location.href);
  // const { currentCorpId = '', agentId = '' } = searchObj;

  let url = changeSearch('staffId', staffId, linkUrl);
  // url = changeSearch('currentCorpId', currentCorpId, url);
  // url = changeSearch('agentId', agentId, url);
  // 删除url无用的t,state参数
  url = changeSearch('t', '', url);
  url = changeSearch('state', '', url);
  return url;
}

// 将url的search部分转化为json
export function searchToJson(url: string, codeURI = false): any {
  const search: string[] = url.split('?');
  let result: object = {};
  search.forEach((item, index) => {
    if (index !== 0) {
      result = item.split('&').reduce((obj, item) => {
        const arr = item.split('=');
        return { ...obj, [arr[0]]: codeURI ? decodeURIComponent(arr[1]) : arr[1] };
      }, result);
    }
  });
  return result;
}

// 获取url参数
export function getUrlQueryString(search: string, name: string): string {
  const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
  const r: RegExpMatchArray | null = search.substr(1).match(reg);
  if (r !== null) {
    return r[2];
  }
  return '';
}

// 改变url search上的参数
export function changeSearch(key: string, value: string, url: string): string {
  let linkUrl: string = url || window.location.href;
  // value 为空的话,url上的查询参数会被清除
  if (linkUrl.includes(key)) {
    linkUrl = linkUrl.replace(
      `&${key}=${getUrlQueryString(`?${linkUrl.split('?')[1]}`, key)}`,
      String(value) ? `&${key}=${value}` : ''
    );
  } else {
    linkUrl += String(value) ? `&${key}=${value}` : '';
  }
  return linkUrl;
}

/**
 * 删除url中某些参数
 * @param url 链接
 * @param arrKeys 要删除的url上的参数key的集合
 * @returns 处理之后的链接
 */
interface IObjAny {
  [propsName: string]: any;
}
export function urlParamDel(url: string, arrKeys: string[]) {
  let local = url.split('?');
  let baseUrl = `${local[0]}?`;
  let query = local[1];
  let obj: IObjAny = {};

  let arr: any[] = query.split('&');
  for (let i = 0; i < arr.length; i++) {
    arr[i] = arr[i].split('=');
    obj[arr[i][0]] = arr[i][1];
  }

  arrKeys.forEach((key) => {
    if (query.indexOf(key) > -1) {
      delete obj[key];
    }
  });

  return (
    baseUrl +
    JSON.stringify(obj)
      .replace(/[\"\{\}]/g, '')
      .replace(/\:/g, '=')
      .replace(/\,/g, '&')
  );
}
// 改变history跳转参数，currentCorpId作用：如果复制了链接发送给客户，不至于页面丢失企业数据
export function withCurrentCorpIdStaffIdPath(path: string, staffId: string): string {
  staffId = staffId || globalData.managerInfo.staffId || '';
  const searchObj = searchToJson(getLocalStorage(keyDict.entrySearch)!);
  const { currentCorpId = '', agentId = '' } = searchObj;
  const url = `${path}${
    path.includes('?') ? '&' : '?'
  }currentCorpId=${currentCorpId}&agentId=${agentId}&staffId=${staffId}`;

  return url;
}

/*
 * aes解密
 * data：要解密的数据
 * key：密钥，16位的字符串
 * iv：密钥偏移量，16位的字符串
 */
export function decrypt(data: any, key = 'fffff11111aaaaa66666ooooo0000099', iv = 'fffff11111aaaaa6'): string {
  if (data) {
    const key1 = CryptoJS.enc.Utf8.parse(key);
    const iv1 = CryptoJS.enc.Utf8.parse(iv);
    const decrypted = CryptoJS.AES.decrypt(data, key1, {
      iv: iv1,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
  } else {
    return '';
  }
}
//  判断所有图片是否加载完
export function allImgLoaded(mulitImg: string[]) {
  let promiseAll = [];
  let img: any = [];
  let imgTotal = mulitImg.length;
  for (let i = 0; i < imgTotal; i++) {
    promiseAll[i] = new Promise((resolve, reject) => {
      img[i] = new Image();
      img[i].src = mulitImg[i];
      img[i].onload = function () {
        // 第i张加载完成
        resolve(img[i]);
      };
    });
  }
  return Promise.all(promiseAll);
}
export function isUrlQeMask(url: string) {
  let newUrl: string = url.startsWith('?') ? url : '?' + url;
  return newUrl;
}

/*
 ** randomWord 产生任意长度随机字母数字组合
 ** randomFlag-是否任意长度 min-任意长度最小位[固定位数] max-任意长度最大位 , true 使用min - max  false 使用 min
 */
export function randomWord(randomFlag: boolean, min: number, max: number) {
  let str = '';
  let range = min;
  let arr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  // 随机产生
  if (randomFlag) {
    range = Math.round(Math.random() * (max - min)) + min;
  }
  for (let i = 0; i < range; i++) {
    const pos = Math.round(Math.random() * (arr.length - 1));
    str += arr[pos];
  }
  return str;
}

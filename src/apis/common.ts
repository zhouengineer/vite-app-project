/*
 * 公共接口
 */
import { IApiModuleProps } from './apiType';
const commonApi: IApiModuleProps = {
  // 授权登录--后端会返回当前微信登录用户的unionId
  login: {
    url: 'index/h5/auth.do',
    method: 'GET',
  },
  // 获取事故信息协助记录信息
  getAccidentDetail: {
    url: 'api/mta-webapi/accident/getAccidentDetail',
    method: 'POST',
    isJson: false,
  },
};

export default commonApi;

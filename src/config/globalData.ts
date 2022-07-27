// 全局状态，值可能为空，并且中间可能会被覆盖，使用前要做判断
interface IGlobalDataProps {
  managerInfo: any; // 经理信息
  visitUserInfo: object; // 当前登录的客户信息
  validCorplist: [];
  currentCorpId: string; // 当前机构corpId
  isIphoneX: boolean; // 是否iPhone X
  paperStaffParams: any; // 产品跳转购买员工自定义参数信息
  isManager: boolean; // 是否是经理本人
  visitorId: string; // 访问者id
  [propName: string]: any;
}

const globalData: IGlobalDataProps = {
  managerInfo: {}, // 经理信息
  visitUserInfo: {}, // 当前登录的客户信息
  validCorplist: [],
  currentCorpId: '', // 当前机构corpId
  isIphoneX: false, // 是否iPhone X
  paperStaffParams: {}, // 产品跳转购买员工自定义参数信息
  isManager: false, // 是否是经理本人
  visitorId: '', // 访问者id
  isCardCheckSuccess: false, // 银行卡检验是否成功
};

export default globalData;

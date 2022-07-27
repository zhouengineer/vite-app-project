import common from './common';
import { IApiItemProps, IApiProps } from './apiType';
const allApis: IApiProps = {
  common, // 公共api
  // redPacket, // 红包裂变
};

// window.$log(allApis);

// 组合api域名--遍历模块名
Object.keys(allApis).forEach((module: string) => {
  // 遍历模块名下的接口
  Object.keys(allApis[module]).forEach((key: string) => {
    const apiItem: IApiItemProps = allApis[module][key];
    // 添加服务名
    allApis[module][key].url = `/${apiItem.url}`;
  });
});

export default allApis;

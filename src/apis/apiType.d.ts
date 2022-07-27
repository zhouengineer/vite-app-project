// api子项类型
export interface IApiItemProps {
  url: string;
  method?: string;
  serviceName?: string;
  isJson?: boolean;
  timeout?: number;
}
// api模块类型
export interface IApiModuleProps {
  [propName: string]: IApiItemProps;
}
// api暴露对象类型
export interface IApiProps {
  [propName: string]: IApiModuleProps;
}

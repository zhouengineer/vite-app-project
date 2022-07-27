/** 共享数据初始值 */
export const defaultState = {
  // 活动规则
  taskRule: '',
  // 隐私政策
  privacyText: '',
};

/** 动作集合 */
export type Action =
  | {
      type: 'setTaskRule';
      taskRule: string;
    }
  | {
      type: 'setPrivacyText';
      privacyText: string;
    };

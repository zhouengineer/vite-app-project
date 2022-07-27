/** 动作定义 */
const reducer = (state: any, action: any) => {
  if (!state) {
    return null;
  }

  switch (action.type) {
    /** 设置活动数据 */
    case 'setTaskRule': {
      // window.$log({ treeData: action.taskRule });
      return {
        ...state,
        taskRule: action.taskRule,
      };
    }

    /** 设置隐私协议 */
    case 'setPrivacyText': {
      // window.$log(action.privacyText);
      return {
        ...state,
        privacyText: action.privacyText,
      };
    }

    default:
      return state;
  }
};

export default reducer;

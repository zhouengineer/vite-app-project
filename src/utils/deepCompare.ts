// 深度比较两个对象是否相等
export default function deepCompare(prevProps: any, nextProps: any) {
  const len: number = arguments.length;
  let leftChain: any[] = [];
  let rightChain: any = [];
  //  window.$log({ arguments });

  if (len < 2) {
    //  window.$log('需要传入2个对象,才能进行两个对象的属性对比');
    return true;
  }
  // window.$log({ prevProps, nextProps });
  if (!compare2Objects(prevProps, nextProps, leftChain, rightChain)) {
    //  window.$log('两个对象不相等');
    return false;
  }

  //  window.$log('两个对象相等');
  return true;
}

function compare2Objects(prevProps: any, nextProps: any, leftChain: any, rightChain: any) {
  let p;

  // 如果对比出结果,返回true|false,否则返回continue,继续下面的比较
  let ret = quickCompareIsEqual(prevProps, nextProps, leftChain, rightChain);
  if (ret !== 'continue') return ret;

  // 遍历下次的属性对象,优先比较不相等的情形
  for (p in nextProps) {
    if (nextProps.hasOwnProperty(p) !== prevProps.hasOwnProperty(p)) {
      // window.$log('nextProps.hasOwnProperty(p) !== prevProps.hasOwnProperty(p)');
      return false;
    } else if (typeof nextProps[p] !== typeof prevProps[p]) {
      // window.$log('typeof nextProps[p] !== typeof prevProps[p]');
      return false;
    }
  }
  //  window.$log('p in prevProps');
  // 遍历上次的属性对象,优先比较不相等的情形
  for (p in prevProps) {
    // 是否都存在某个属性值
    if (nextProps.hasOwnProperty(p) !== prevProps.hasOwnProperty(p)) {
      // window.$log('nextProps.hasOwnProperty(p) !== prevProps.hasOwnProperty(p)');
      return false;
    }
    // 属性值的类型是否相等
    else if (typeof nextProps[p] !== typeof prevProps[p]) {
      // window.$log('typeof nextProps[p] !== typeof prevProps[p]');
      return false;
    }

    // window.$log('typeof prevProps[p]', typeof prevProps[p]);
    switch (typeof prevProps[p]) {
      // 对象类型和函数类型的处理
      case 'object':
      case 'function':
        leftChain.push(prevProps);
        rightChain.push(nextProps);

        if (!compare2Objects(prevProps[p], nextProps[p], leftChain, rightChain)) {
          // window.$log('!compare2Objects(prevProps[p], nextProps[p], leftChain, rightChain)');
          return false;
        }

        leftChain.pop();
        rightChain.pop();
        break;

      default:
        // 基础类型的处理
        if (prevProps[p] !== nextProps[p]) {
          return false;
        }
        break;
    }
  }

  return true;
}

// 快速判断两个对象是否相等
function quickCompareIsEqual(prevProps: any, nextProps: any, leftChain: any, rightChain: any) {
  // 两个值都为为NaN时,在js中是不相等的, 而在这里认为相等才是合理的
  if (isNaN(prevProps) && isNaN(nextProps) && typeof prevProps === 'number' && typeof nextProps === 'number') {
    return true;
  }

  // 原始值比较
  if (prevProps === nextProps) {
    // window.$log('原始值', prevProps, nextProps);
    return true;
  }

  // 构造类型比较
  let result = toStringCompare({ prevProps, nextProps });
  if (result !== 'continue') return result;

  // 两个比较变量的值如果是null和undefined,在这里会退出
  if (!(prevProps instanceof Object && nextProps instanceof Object)) {
    // window.$log(prevProps, nextProps, 'prevProps instanceof Object && nextProps instanceof Object');
    return false;
  }

  if (prevProps.isPrototypeOf(nextProps) || nextProps.isPrototypeOf(prevProps)) {
    // window.$log('prevProps.isPrototypeOf(nextProps) || nextProps.isPrototypeOf(prevProps)');
    return false;
  }

  // 构造器不相等则两个对象不相等
  if (prevProps.constructor !== nextProps.constructor) {
    // window.$log('prevProps.constructor !== nextProps.constructor');
    return false;
  }

  // 原型不相等则两个对象不相等
  if (prevProps.prototype !== nextProps.prototype) {
    // window.$log('prevProps.prototype !== nextProps.prototype');
    return false;
  }

  if (leftChain.indexOf(prevProps) > -1 || rightChain.indexOf(nextProps) > -1) {
    // window.$log('leftChain.indexOf(prevProps) > -1 || rightChain.indexOf(nextProps) > -1');
    return false;
  }

  return 'continue';
}
// 构造类型转换成字符串进行比较
function toStringCompare({ prevProps, nextProps }: { prevProps: any; nextProps: any }) {
  // 构造类型比较
  if (
    (typeof prevProps === 'function' && typeof nextProps === 'function') ||
    (prevProps instanceof Date && nextProps instanceof Date) ||
    (prevProps instanceof RegExp && nextProps instanceof RegExp) ||
    (prevProps instanceof String && nextProps instanceof String) ||
    (prevProps instanceof Number && nextProps instanceof Number)
  ) {
    // window.$log('function', prevProps.toString() === nextProps.toString());
    return prevProps.toString() === nextProps.toString();
  }
  return 'continue';
}

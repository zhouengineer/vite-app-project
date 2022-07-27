import VConsole from 'vconsole';
import { setSession } from '@/utils';

setIosInputFocus();
setFontSize();
setVConsole();

// 解决ios下输入框点击不唤起软键盘的bug
function setIosInputFocus(): void {
  document.body.addEventListener('click', (e) => {
    const dom = e.target as HTMLElement;
    const { tagName } = dom;
    if (tagName === 'INPUT' || tagName === 'TEXTAREA' || dom.getAttribute('contenteditable') === 'true') {
      dom.focus();
    }
  });
}

// 设置字体
function setFontSize(): void {
  const setRem = () => {
    const deviceWidth = document.documentElement.clientWidth;
    // 获取相对UI稿，屏幕的缩放比例
    const scale = deviceWidth / 750;
    // 动态设置html的font-size
    document.querySelector('html')!.style.fontSize = 100 * scale + 'px';
  };

  setRem();

  // 窗口改变重新设置
  window.onresize = function () {
    setRem();
  };
}

// 设置vConsole，默认隐藏。生产环境在url上加参数
function setVConsole(): void {
  new VConsole();
  // 生产环境,url的查询参数中有debug时，显示vConsole
  // vite报错信息不准
  // window.$log('import.meta.env.VITE_BUILD_ENV', import.meta.env.VITE_BUILD_ENV);
  if (import.meta.env.MODE === 'prod') {
    location.search.indexOf('debug') !== -1 && prodEnvDisplayVConsole();
  } else {
    // 其余环境, 连续点击12次以上，开启vConsole
    otherEnvDisplayVConsole();
  }
}

function prodEnvDisplayVConsole(): void {
  const timer: any = setInterval(() => {
    let consoleDom: HTMLElement | null = document.querySelector('#__vconsole');
    if (consoleDom) {
      consoleDom && (consoleDom.style.display = 'block');
      consoleDom = null;
      clearInterval(timer);
    }
  }, 1000);
}

function otherEnvDisplayVConsole(): void {
  let timer2: any = setInterval(() => {
    let consoleDom: HTMLElement | null = document.querySelector('#__vconsole');
    if (consoleDom) {
      clearInterval(timer2);
      setSession('vConsole_switch_y', 300);
      timer2 = null;
      let count = 0;
      let timer: any = null;
      const showVconsole = () => {
        count++;
        // 点击12次出现
        if (count >= 12) {
          consoleDom && (consoleDom.style.display = 'block');
          consoleDom = null;
          clearTimeout(timer);
          timer = null;
          document.body.removeEventListener('click', showVconsole);
          count = 0;
          return;
        }
        clearTimeout(timer);
        timer = setTimeout(() => {
          count = 0;
        }, 400);
      };
      document.body.addEventListener('click', showVconsole);
    }
  }, 1000);
}

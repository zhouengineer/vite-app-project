import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { ConfigEnv, UserConfigExport, defineConfig } from 'vite';
import legacy from '@vitejs/plugin-legacy';
import reactRefresh from '@vitejs/plugin-react-refresh'; // 提供React Refresh支持
import vitePluginImp from 'vite-plugin-imp'; // 按需加载组件
import eslintPlugin from 'vite-plugin-eslint';

// 微信真机调试判断
const isEnableWXSDK = process.argv.includes('wx');

export default ({ command, mode }: ConfigEnv) => {
  // 更新node运行环境变量
  updateProcessEnv({ command, mode });

  // 配置项
  const config: UserConfigExport = {
    resolve: {
      alias: {
        '@/': path.resolve(__dirname, './src/'),
        '@/apis': path.resolve(__dirname, './src/apis/'),
        '@/assets': path.resolve(__dirname, './src/assets/'),
        '@/image': path.resolve(__dirname, './src/assets/image/'),
        '@/components': path.resolve(__dirname, './src/components/'),
        '@/config': path.resolve(__dirname, './src/config/'),
        '@/pages': path.resolve(__dirname, './src/pages/'),
        '@/routers': path.resolve(__dirname, './src/routers/'),
        '@/utils': path.resolve(__dirname, './src/utils/'),
        '@/httpTypes': path.resolve(__dirname, './src/typings/httpTypes'),
        '@/store': path.resolve(__dirname, './src/store/'),
      },
    },
    plugins: [
      legacy({
        // 在开发模式,兼容chrome低版本浏览器
        targets: ['chrome >= 77'],
      }),
      reactRefresh(),
      vitePluginImp({
        libList: [
          {
            libName: 'antd-mobile',
            style: (name) => `antd-mobile/es/${name}/style/index.css`,
            libDirectory: 'es',
          },
        ],
      }),
      eslintPlugin(),
    ],
    // 避免cjs和es混合编写的三方库报错
    build: { commonjsOptions: { transformMixedEsModules: true } },
  };

  // serve 独有配置
  if (command === 'serve') {
    config.define = {
      'process.env.NODE_ENV': JSON.stringify('development'),
      'process.env.WX_JS_SDK_ENABLED': isEnableWXSDK, // 真机调试SDK模式
    };

    const openUrl = {
      // 红包地址
      redPacketUrl: `/admin-app/accidentInfoRecord?id=335442979889643520`,
    };

    console.log('process.env.VITE_API_HOST', process.env.VITE_API_HOST);

    config.server = {
      host: '0.0.0.0',
      port: 8001,
      open: isEnableWXSDK ? false : openUrl.redPacketUrl,
      hmr: true,
      proxy: {
        '/api/': {
          target: process.env.VITE_API_HOST,
          // target: 'http://192.168.17.149:9098',
          changeOrigin: true,
        },
        '/apis/': {
          // target: 'http://192.168.17.149:9199',
          target: process.env.VITE_API_HOST,
          changeOrigin: true,
        },
        // '/test': {
        //   target: 'http://192.168.6.196:9099',
        //   changeOrigin: true,
        // },
      },
      // 屏蔽命令窗口的文件访问限制警告
      fs: {
        strict: false,
      },
    };
  } else if (command === 'build') {
    // build 独有配置
    config.define = {
      'process.env.NODE_ENV': JSON.stringify('production'),
    };

    // cos上传
    if (process.env.IS_UPLOAD_CDN === 'enable') {
      try {
        // 获取环境：dev/test/test2/test3/uat/prod
        const appEnv = process.env.APP_ENV || '';
        // 获取cos配置项
        const cosCfg = JSON.parse(process.env.FE_COS_CFG || '{}');
        // 使用cos地址
        config.base = `${cosCfg[appEnv].cdnHost}/apps/${process.env.APP_NAME}/${process.env.APP_VERSION}/`;
      } catch (err) {
        console.log('解析环境变量失败：', err);
      }
    }
  }

  // 包裹 ts 类型提示
  return defineConfig(config);
};

// 更新node运行环境变量
function updateProcessEnv({ command, mode }: ConfigEnv): void {
  const envFilePath: any = getEnvFilePath(mode);

  try {
    // 根据环境变量加载环境变量文件
    const envFile: object = dotenv.parse(fs.readFileSync(envFilePath));

    // 根据获取的key给对应的环境变量赋值
    for (const key in envFile) {
      process.env[key] = envFile[key];
    }
  } catch (e) {
    console.error(e);
  }
}

// 获取可加载的环境变量文件路径
function getEnvFilePath(mode: string): string | never {
  const modeFilePath = path.join(__dirname, `./.env.${mode}`);
  const localFilePath = path.join(__dirname, './.env.local');

  if (fs.existsSync(modeFilePath)) {
    console.log(`使用${mode}模式配置文件`);
    return modeFilePath;
  } else if (fs.existsSync(localFilePath)) {
    console.log(`${mode}模式配置文件不存在，将使用本地模式配置文件`);
    return localFilePath;
  } else {
    console.log(`${mode}模式和本地模式配置文件均不存在，请按照 README 执行或者检查项目文件`);
    process.exit(1);
  }
}

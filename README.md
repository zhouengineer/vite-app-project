# admin-app

H5 推广活动

## 开发方法

### 安装依赖

```shell
yarn
```

### 初始化 .env.local 文件

```shell
yarn gen:env
```

默认会生成开发环境配置，如需要调试其他环境，可直接修改 .env.local 文件，注意不要提交到 Git 版本库

### 本地开发

```shell
yarn start
```

#### 可选启动模式

| 命令               | 对应接口域名                         | 备注                                           |
| ------------------ | ------------------------------------ | ---------------------------------------------- |
| `yarn start`       |                                      | `yarn start:local` 别名                        |
| `yarn start:local` | 默认为 `dev.tengmoney.com`，可自定义 | 本地开发模式，配置可自行更改，不提交到版本库中 |
| `yarn start:dev`   | `dev.tengmoney.com`                  | 修改要走版本管理                               |
| `yarn start:test`  | `test-lbhd.xinhanyx.com`             | 修改要走版本管理                               |
| `yarn start:test2` | `test2-lbhd.xinhanyx.com`            | 修改要走版本管理                               |
| `yarn start:test3` | `test3-lbhd.xinhanyx.com`            | 修改要走版本管理                               |
| `yarn start:uat`   | `uat-lbhd.xinhanyx.com`              | 修改要走版本管理                               |
| `yarn start:prod`  | `www.xinhanyx.com`                   | 修改要走版本管理                               |

#### 真机调试使用 JS-SDK

对应命令后面添加`:wx` 即可在开发模式下开启企业微信 `JS-SDK` 方便在真机下调试

示例：

```shell
yarn start:dev:wx
```

需要配置 whistle 代理，见 [配置 whistle 代理](https://www.tapd.cn/61702827/markdown_wikis/show/#1161702827001000529@toc11)

## 本地编译

```shell
yarn build
```

### 可选编译模式

| 命令               | 对应接口域名                         | 备注                                           |     |
| ------------------ | ------------------------------------ | ---------------------------------------------- | --- |
| `yarn build`       |                                      | `yarn build:local` 的别名                      |
| `yarn build:local` | 默认为 `dev.tengmoney.com`，可自定义 | 本地编译模式，配置可自行更改，不提交到版本库中 |
| `yarn build:dev`   | `dev.tengmoney.com`                  | 修改要走版本管理                               |
| `yarn build:test`  | `test-lbhd.xinhanyx.com`             | 修改要走版本管理                               |
| `yarn build:test2` | `test2-lbhd.xinhanyx.com`            | 修改要走版本管理                               |
| `yarn build:test3` | `test3-lbhd.xinhanyx.com`            | 修改要走版本管理                               |
| `yarn build:uat`   | `uat-lbhd.xinhanyx.com`              | 修改要走版本管理                               |
| `yarn build:prod`  | `www.xinhanyx.com`                   | 修改要走版本管理，生产环境慎重修改             |

> 编译模式下，`NODE_ENV=production`，不走 testLogin 登录，开启微信 JS-SDK，各种地址使用相应配置文件里的配置

## 持续集成编译发布

参见 [前端 Git 规范 V2.0](https://www.tapd.cn/61702827/markdown_wikis/show/#1161702827001000528) 合并到相应分支，即可触发相应环境流水线编译并发布（需人工确认）到各环境

### `NODE_ENV` 使用规范

- `NODE_ENV` 只允许设置 2 种值 `development` 和 `production`。
- `NODE_ENV=development` 代表非生产模式，只在开发联调过程中生效。`yarn start:*` 即走这种模式。
- `NODE_ENV=production` 代表生产模式，在 `dev`、`test`、`test2`、`test3`、`uat`、`prod` 环境中生效。`yarn build:*` 即走这种模式。
  - CI 流水线中 `NODE_ENV=production`
  - 本地也可以编译，本地编译的是生产模式，只有 `yarn start` 才走非生产模式

## 自定义环境变量

Vite 使用 dotenv 从 .env.\* 文件加载额外的环境变量，加载的环境变量可以通过 `import.meta.env` 访问。

注意：

- 为防止意外地将一些环境变量泄漏到客户端，只有以 `VITE_` 为前缀的变量才允许在客户端访问到。
- VITE\_\* 变量不能包含任何敏感信息。

现有环境变量字段说明：

| 变量名             | 说明                                                                        | 备注                                 |
| ------------------ | --------------------------------------------------------------------------- | ------------------------------------ |
| VITE_API_HOST      | 接口域名                                                                    | 可以改成合作的后台同学的电脑 ip 地址 |
| VITE_SITE_HOST     | 站点域名，分享页面等场景会用到，和接口域名(VITE_API_HOST)不一定是同一个域名 | 可以改成自已想要的                   |
| VITE_TEST_CORP_ID  | 模拟企业 ID                                                                 | 只在`NODE_ENV=development`时有用     |
| VITE_TEST_USER_ID  | 模拟企业用户 ID                                                             | 只在`NODE_ENV=development`时有用     |
| VITE_SC_SERVER_URL | 神策埋点上报地址                                                            | 除生产之外的环境全部上报到测试地址   |

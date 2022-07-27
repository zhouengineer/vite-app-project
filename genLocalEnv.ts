// 生成.env.local文件
const fs = require('fs');
const path = require('path');

// 选用.env.dev作为模板文件
generateFile('./.env.dev', './.env.local');

// 生成文件
function generateFile(source, target) {
  // 源路径
  const sourcePath = getPath(source);
  // 校验文件是否存在
  checkFileExist(sourcePath);

  // 读取源文件的内容，并修改为local相关
  const sourceFile = fs.readFileSync(sourcePath);
  // 过滤第一行
  const sourceContent = sourceFile
    .toString()
    .split('\r')
    .filter((item, index) => {
      return index > 0;
    });
  // 添加第一行描述
  sourceContent.unshift('\n# LOCAL 本地开发环境变量配置，只在本地生效，不会提交到版本库');

  // 目标路径
  const targetPath = getPath(target);
  // 写入文件
  fs.writeFileSync(targetPath, sourceContent.join('\r'));

  // 输出高亮
  const clc = {
    green: (text) => `\x1B[32m${text}\x1B[39m`,
    yellow: (text) => `\x1B[33m${text}\x1B[39m`,
    red: (text) => `\x1B[31m${text}\x1B[39m`,
    magentaBright: (text) => `\x1B[95m${text}\x1B[39m`,
    cyanBright: (text) => `\x1B[96m${text}\x1B[39m`,
  };
  console.log(clc.green('本地环境 .env.local 文件创建成功'));
}

// 校验文件是否存在
function checkFileExist(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`${filePath}不存在，请检查项目文件`);
    process.exit(1);
  }
}

// 获取文件路径
function getPath(relativePath) {
  return path.join(__dirname, relativePath);
}

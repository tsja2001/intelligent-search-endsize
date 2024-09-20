const fs = require('fs')
const path = require('path')

// 动态注册路由
const autoRegister = (app) => {
  // 拿到当前文件夹下所有文件名
  const res = fs.readdirSync(path.resolve(__dirname))

  for (let i = 0; i < res.length; i++) {
    // 如果是当前auto_register.js文件则不注册
    if (!res[i].endsWith('.router.js')) {
      continue
    }

    // 根据文件名引入文件
    const router = require(`./${res[i]}`)

    // 注册了路由
    app.use(router.routes())
    app.use(router.allowedMethods())
  }
}

module.exports = { autoRegister }

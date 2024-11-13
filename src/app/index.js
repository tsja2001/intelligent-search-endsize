// const userRouter = require('../router/user.router')
// const loginRouter = require('../router/login.router')
const { autoRegister } = require('../router/auto_register')
// const bodyPaser = require('koa-bodyparser')
const koaBody = require('koa-body').default
const fs = require('fs')
const path = require('path')

const Koa = require('koa')
// const multer = require('@koa/multer')

const app = new Koa()

app.use(
  koaBody({
    multipart: true,
    formidable: {
      uploadDir: './uploads',
      keepExtensions: true,
    },
  })
)

// app.use(bodyPaser())

// const upload = multer()
// app.use(upload.single('file'))

// 错误处理中间件
app.use(async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    ctx.status = err.status || 500
    ctx.body = {
      message: err.message || 'Internal Server Error',
    }
    ctx.app.emit('error', err, ctx)
  }
})

// // 用户
// app.use(userRouter.routes())
// app.use(userRouter.allowedMethods())
// // 登陆
// app.use(loginRouter.routes())
// app.use(loginRouter.allowedMethods())
// 自动注册路由, 代替上面手动注册的写法⬆

// 当访问跟路径时, 返回index.html
app.use(async (ctx, next) => {
  if (ctx.path === '/') {
    ctx.set('Content-Type', 'text/html')
    ctx.body = fs.createReadStream(path.join(__dirname, './front/index.html'))
  } else if (ctx.path === '/aaa') {
    ctx.set('Content-Type', 'text/html')
    ctx.body = fs.createReadStream(path.join(__dirname, './index.html'))
  } else if (ctx.path === '/bbb') {
    ctx.set('Content-Type', 'text/html')
    ctx.body = fs.createReadStream(path.join(__dirname, './index1.html'))
  }
   {
    await next()
  }
})

autoRegister(app)

module.exports = app

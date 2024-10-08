// const userRouter = require('../router/user.router')
// const loginRouter = require('../router/login.router')
const { autoRegister } = require('../router/auto_register')
const bodyPaser = require('koa-bodyparser')

const Koa = require('koa')

const app = new Koa()

app.use(bodyPaser())

// 错误处理中间件
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = {
      message: err.message || 'Internal Server Error',
    };
    ctx.app.emit('error', err, ctx);
  }
});

// app.use

// // 用户
// app.use(userRouter.routes())
// app.use(userRouter.allowedMethods())
// // 登陆
// app.use(loginRouter.routes())
// app.use(loginRouter.allowedMethods())
// 自动注册路由, 代替上面手动注册的写法⬆
autoRegister(app)

module.exports = app

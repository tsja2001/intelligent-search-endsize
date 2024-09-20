const KoadRouter = require('@koa/router')
const loginController = require('../controller/login.controller')
const {
  verifyLoginin,
  varifyAuth,
} = require('../middleware/login.middleware')

const loginRouter = new KoadRouter({
  prefix: '/login',
})

try {
  loginRouter.post('/', verifyLoginin, loginController.sign)
} catch (error) {
  console.log('error', error)
}

loginRouter.get('/test', varifyAuth, (ctx) => {
  ctx.body = '111'
})

module.exports = loginRouter

const {
  NAME_OR_PASSWORD_IS_REQUIRED,
  PASSWORD_IS_INCORRENT,
  USER_IS_NOT_EXISTS,
  UN_AUTHORIZATION,
  NONE_TOKEN,
} = require('../config/error')
const userService = require('../service/user.service')
const md5password = require('../utils/md5-password')
const jwt = require('jsonwebtoken')
const { publicKey } = require('../config/screct')

const verifyLoginin = async (ctx, next) => {
  const { username, password } = ctx.request.body
  // 判断用户名密码不为空
  if (!username || !password) {
    // return ctx.app.emit('error', "判断用户名密码不为空", ctx)

    const error = new Error("用户名密码不为空")
    error.status = 400
    throw error
  }
  // 判断用户是否存在
  const queryedUsers = await userService.findUserByName(username)
  if (!queryedUsers[0]) {
    // return ctx.app.emit('error', "用户名不存在", ctx)

    const error = new Error("用户名不存在")
    error.status = 400
    throw error
  }

  // 验证密码
  const md5Pwd = queryedUsers[0].password
  if (md5Pwd !== md5password(password)) {
    // return ctx.app.emit('error', "密码错误", ctx)
    const error = new Error("密码错误")
    error.status = 400
    throw error
  }

  // 将用户名密码存在ctx中
  ctx.user = queryedUsers[0]

  await next()
}

// 验证用户token
const varifyAuth = async (ctx, next) => {
  const bearerToken = ctx.header.authorization
  if (!bearerToken) {
    return ctx.app.emit('error', NONE_TOKEN, ctx)
  }

  const token = bearerToken.replace('Bearer ', '')

  try {
    const res = jwt.verify(token, publicKey, {
      algorithms: ['RS256'],
    })

    ctx.user = res
    await next()
  } catch (err) {
    console.log('[ err ] >', err)
    return ctx.app.emit('error', UN_AUTHORIZATION, ctx)
  }

  // await next()
}

module.exports = {
  verifyLoginin,
  varifyAuth,
}

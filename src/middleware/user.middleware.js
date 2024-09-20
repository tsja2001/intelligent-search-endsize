const {
  NAME_OR_PASSWORD_IS_REQUIRED,
  NAME_IS_ALREADY_EXISTS,
  NAME_IS_NOT_EXISTS,
} = require('../config/error')
const userService = require('../service/user.service')
const md5password = require('../utils/md5-password')

const verifyUser = async (ctx, next) => {
  const { username, password } = ctx.request.body
  // 判断用户名密码不为空
  if (!username || !password) {
    const error = new Error(NAME_OR_PASSWORD_IS_REQUIRED)
    error.status = 400
    throw error
  }
  // 判断用户是否存在
  const queryedUsers = await userService.findUserByName(username)
  if (queryedUsers.length) {
    const error = new Error("用户名已存在")
    error.status = 400
    throw error
  }

  await next()
}

const verifyUserExist = async (ctx, next) => {
  const { id } = ctx.params
  const queryedUsers = await userService.getUserInfoById(id)
  if (!queryedUsers) {
    const error = new Error('用户不存在')
    error.status = 400
    throw error
  }
  ctx.user = queryedUsers[0]
  await next()
}

const handlePassword = async (ctx, next) => {
  const { password } = ctx.request.body
  ctx.request.body.password = md5password(password)
  await next()
}

module.exports = {
  verifyUser,
  handlePassword,
  verifyUserExist,
}

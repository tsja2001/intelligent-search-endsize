const userService = require('../service/user.service')
const md5password = require('../utils/md5-password')

class UserController {
  async create(ctx, next) {
    // 1.获取用户传过来的信息
    const user = ctx.request.body
    // 2.将user数据存储在数据库中
    const res = await userService.create(user)
    // 3.查看存储结果, 告诉前端存储成功
    ctx.body = {
      message: '创建成功',
      data: {
        res: res,
      },
    }
  }

  async getUserInfoByID(ctx, next) {
    // 1.获取用户传过来的ID
    const id = ctx.params.id
    // 2.根据ID查询用户信息
    const res = await userService.getUserInfoById(id)

    ctx.body = {
      message: '查询成功',
      data: res,
    }
  }

  async getUserInfoByName(ctx, next) {
    // 1.获取用户传过来的name
    const username = ctx.query.username
    // 2.根据name查询用户信息
    const res = await userService.findUserByName(username)

    if (!res.length) {
      ctx.body = {
        message: '用户不存在',
        data: res,
      }
      ctx.status = 400
    } else {
      ctx.body = {
        message: '查询成功',
        data: res,
      }
    }
  }

  async deleteUserById(ctx, next) {
    // 1.获取用户传过来的ID
    const id = ctx.params.id
    // 2.根据ID删除用户信息
    const res = await userService.deleteUserById(id)

    ctx.body = {
      message: '删除成功',
      data: res,
    }
  }

  async updateUserById(ctx, next) {
    // 1.获取用户传过来的ID
    const id = ctx.params.id
    // 2.获取用户传过来的数据
    const user = ctx.request.body

    // 查找此用户
    const queryedUsers = await userService.getUserInfoById(id)

    const username = user.username ?? queryedUsers.username

    const role = user.role ?? queryedUsers.role

    const password = user.password
      ? md5password(user.password)
      : queryedUsers.password

    // 3.根据ID更新用户信息
    await userService.updateUserById(id, username, role, password)

    // 4.获取最新的用户信息
    const newUserInfo = await userService.getUserInfoById(id)

    ctx.body = {
      message: '更新成功',
      data: newUserInfo,
    }
  }

  async getUserList(ctx, next) {
    // 1.获取用户传过来的分页信息
    const { offset, size, username } = ctx.query
    // 2.查询用户列表
    const res = await userService.getUserList(offset, size, username)

    ctx.body = {
      message: '查询成功',
      data: res,
    }
  }
}

module.exports = new UserController()

const tagService = require('../service/tag.service')
const userService = require('../service/user.service')
const md5password = require('../utils/md5-password')

class TagController {
  async create(ctx, next) {
    const body = ctx.request.body
    const res = await tagService.create(body)
    // 查询此标签
    const tag = await tagService.getByName(body.name)
    // 3.查看存储结果, 告诉前端存储成功
    ctx.body = {
      message: '创建成功',
      data: tag[0],
    }
  }

  async getList(ctx, next) {
    // const name = ctx.params?.name
    const name = ctx.query.name
    // console.log('name', name)
    // 1.查询所有标签
    const res = await tagService.getList(name)
    // 2.返回所有标签
    ctx.body = {
      message: '查询成功',
      data: res,
    }
  }

  async getByName(ctx, next) {
    const name = ctx.query.name
    const res = await tagService.getByName(name)
    ctx.body = {
      message: '查询成功',
      data: res,
    }
  }
}

module.exports = new TagController()

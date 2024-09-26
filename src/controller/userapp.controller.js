const userappService = require('../service/userapp.service')

class UserappController {
  async create(ctx, next) {
    console.log('------------------------')
    const openid = ctx.header["x-wx-openid"]
    
    const body = ctx.request.body
    body.openid = openid
    console.log(body)
    const res = await userappService.create(body)
    // 查询此标签
    // const tag = await userappService.getByName(body.name)
    // 3.查看存储结果, 告诉前端存储成功
    ctx.body = {
      message: '创建成功',
      // data: tag[0],
    }
  }

  // async getList(ctx, next) {
  //   // const name = ctx.params?.name
  //   const name = ctx.query.name
  //   // console.log('name', name)
  //   // 1.查询所有标签
  //   const res = await tagService.getList(name)
  //   // 2.返回所有标签
  //   ctx.body = {
  //     message: '查询成功',
  //     data: res,
  //   }
  // }

  // async getByName(ctx, next) {
  //   const name = ctx.query.name
  //   const res = await tagService.getByName(name)
  //   ctx.body = {
  //     message: '查询成功',
  //     data: res,
  //   }
  // }
}

module.exports = new UserappController()

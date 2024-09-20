const imageService = require('../service/image.service')
const COS = require('cos-nodejs-sdk-v5')

class ImageController {
  async create(ctx, next) {
    const body = ctx.request.body
    const res = await imageService.create(body)
    // 3.查看存储结果, 告诉前端存储成功
    ctx.body = {
      message: '创建成功',
      data: {
        res: res,
      },
    }
  }

  async getList(ctx, next) {
    const furniture_id = ctx.params.furniture_id
    // 1.查询所有标签
    const res = await imageService.getList(furniture_id)
    // 2.返回所有标签
    ctx.body = {
      message: '查询成功',
      data: res,
    }
  }

  async remove(ctx, next) {
    const id = ctx.params.id
    const res = await imageService.remove(id)
    ctx.body = {
      message: '删除成功',
      data: res,
    }
  }

  async setFirst(ctx, next) {
    const id = ctx.params.id
    const res = await imageService.setFirst(id)
    ctx.body = {
      message: '设置成功',
      data: res,
    }
  }

  // 预签名
  async getPresign(ctx, next) {
    const res = await imageService.getPresign()

    ctx.body = {
      message: '获取预签名成功',
      data: res,
    }
  }
}

module.exports = new ImageController()

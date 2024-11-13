const imageService = require('../service/image.service')
const fs = require('fs')
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

  upload = async (ctx, next) => {

    let imageBuffer

    try {
      const file = ctx.request.files.file
      const reader = fs.createReadStream(file.filepath)
      imageBuffer = await this.streamToBuffer(reader)
    } catch (err) {
      console.log('err1', err)
    }
    const imgUrl = await imageService.uploadImageToTencentCloud(imageBuffer)
    ctx.body = {
      code: 200,
      data: imgUrl,
      message: '上传成功',
    }
  }

  streamToBuffer(stream) {
    return new Promise((resolve, reject) => {
      const chunks = []
      stream.on('data', (chunk) => chunks.push(chunk))
      stream.on('end', () => resolve(Buffer.concat(chunks)))
      stream.on('error', reject)
    })
  }
}

module.exports = new ImageController()

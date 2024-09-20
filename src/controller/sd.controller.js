// const tagService = require('../service/tag.service')
const imageService = require('../service/image.service')
const sdService = require('../service/sd.service')
const SdService = require('../service/sd.service')
const userService = require('../service/user.service')
const md5password = require('../utils/md5-password')

class SdController {
  async inpaint(ctx, next) {
    const body = ctx.request.body
    console.log('body', body)

    const res = await sdService.inpaint(body)
    ctx.type = 'image/png'
    ctx.body = {
      message: '创建成功',
      data: res,
    }
  }

  async style(ctx) {
    const body = ctx.request.body
    console.log('body', body)

    const res = await sdService.style(body)
    ctx.type = 'image/png'
    ctx.body = {
      message: '创建成功',
      data: res,
    }
  }

  async sketch(ctx) {
    const body = ctx.request.body
    console.log('body', body)

    const res = await sdService.sketch(body)
    ctx.type = 'image/png'
    ctx.body = {
      message: '创建成功',
      data: res,
    }
  }

  async searchAndRecolor(ctx, next) {
    const body = ctx.request.body
    console.log('body', body)

    const res = await sdService.searchAndRecolor(body)
    ctx.type = 'image/png'
    ctx.body = {
      message: '创建成功',
      data: res,
    }
  }
  async structure(ctx, next) {
    const body = ctx.request.body
    console.log('body', body)

    const res = await sdService.structure(body)
    ctx.type = 'image/png'
    ctx.body = {
      message: '创建成功',
      data: res,
    }
  }

  async generateSd3(ctx, next) {
    const body = ctx.request.body
    console.log('body', body)

    const res = await sdService.generateSd3(body)
    ctx.type = 'image/png'
    ctx.body = {
      message: '创建成功',
      data: res,
    }
  }

  async generateSdUltra(ctx, next) {
    const body = ctx.request.body
    console.log('body', body)

    const res = await sdService.generateSdUltra(body)
    ctx.type = 'image/png'
    ctx.body = {
      message: '创建成功',
      data: res,
    }
  }
}

module.exports = new SdController()

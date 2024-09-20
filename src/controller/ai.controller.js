const aiService = require('../service/ai.service')
const sdService = require('../service/sd.service')
const translateService = require('../service/translate.service')
const userService = require('../service/user.service')
const md5password = require('../utils/md5-password')

class AiController {
  // Existing create method
  async create(ctx, next) {
    const body = ctx.request.body
    const data = await aiService.create(body)
    // const res = await aiService.getById(insertId) // Ensure async operation completes
    ctx.body = {
      message: '创建成功',
      data,
    }
  }

  // 创建Ai生成记录, 并生成图片
  async recordAndGenerate(ctx) {
    const body = ctx.request.body

    // 1. 翻译提示词内容
    const transRes = await translateService.translate({
      SourceText: body.prompt,
    })

    let generated_image_url = ''

    // 2. 开始请求图片
    console.log('开始请求图片, 调用sd API')
    switch (body.type) {
      // 装修
      case 'renovating':
        generated_image_url = await sdService.structure({
          imageUrl: body.original_image_url,
          prompt: transRes.TargetText,
        })
        break

      case 'replace':
        generated_image_url = await sdService.inpaint({
          imageUrl: body.original_image_url,
          maskUrl: body.mask_image_url,
          prompt: transRes.TargetText,
          grow_mask: body.grow_mask ?? 75,
        })
        break
      case 'recolor':
        const select_prompt_transRes = await translateService.translate({
          SourceText: body.select_prompt,
        })
        generated_image_url = await sdService.searchAndRecolor({
          imageUrl: body.original_image_url,
          maskUrl: body.mask_image_url,
          select_prompt: select_prompt_transRes.TargetText,
          prompt: transRes.TargetText,
          grow_mask: body.grow_mask ?? 20,
        })
        break
      case 'styleReplace':
        generated_image_url = await sdService.style({
          imageUrl: body.original_image_url,
          prompt: transRes.TargetText,
        })
        break
      default:
        break
    }

    // 3. 创建ai生成记录
    console.log('创建ai生成记录')
    const res = await aiService.create({
      ...body,
      generated_image_url,
      transPrompt: transRes.TargetText,
    })

    ctx.body = {
      message: '创建成功',
      data: res,
    }
  }

  // Get by ID method
  async getById(ctx) {
    const { id } = ctx.params
    const data = await aiService.getById(id)
    ctx.body = {
      message: '记录获取成功',
      data,
    }
  }

  // Update method
  async update(ctx) {
    const { id } = ctx.params
    const body = ctx.request.body
    const data = await aiService.update(id, body)
    ctx.body = {
      message: '记录更新成功',
      data,
    }
  }

  // Delete method
  async delete(ctx) {
    const { id } = ctx.params
    await aiService.delete(id)
    ctx.body = {
      message: '记录删除成功',
    }
  }

  // Get list by user ID method
  async getListByUserId(ctx) {
    const { user_id } = ctx.params
    const data = await aiService.getListByUserId(user_id)
    ctx.body = {
      message: '用户记录获取成功',
      data,
    }
  }

  async getList(ctx) {
    const data = await aiService.getList()
    ctx.body = {
      message: '获取成功',
      data,
    }
  }
}

module.exports = new AiController()

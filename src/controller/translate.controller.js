const tagService = require('../service/tag.service')
const translateService = require('../service/translate.service')
const userService = require('../service/user.service')
const md5password = require('../utils/md5-password')

class TranslateController {
  async translate(ctx, next) {
    const body = ctx.request.body
    const res = await translateService.translate(body)
    // 查询此标签
    // const tag = await tagService.getByName(body.name)
    // 3.查看存储结果, 告诉前端存储成功
    ctx.body = {
      message: '翻译成功',
      data: res,
    }
  }

}

module.exports = new TranslateController()

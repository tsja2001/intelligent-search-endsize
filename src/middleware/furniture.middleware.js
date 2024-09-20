const furnitureService = require('../service/furniture.service')

const varifyFurniture = async (ctx, next) => {
  const { merchant_id, title } = ctx.request.body
  if (!merchant_id) {
    return ctx.app.emit('error', '商家id不能为空', ctx)
  }
  if (!title) {
    return ctx.app.emit('error', '家具标题不能为空', ctx)
  }

  await next()
}

module.exports = {
  varifyFurniture,
}

const imageService = require("../service/image.service")

const varifyImage = async (ctx, next) => {
  // // 验证标签是否为空
  // const { name } = ctx.request.body
  // if (!name) {
  //   return ctx.app.emit('error', "标签不能为空", ctx)
  // }
  // // 验证标签是否重复
  // const res = await imageService.getByName(name)
  // if (res.length) {
  //   return ctx.app.emit('error', "标签已存在", ctx)
  // }

  await next()
}

// 根据id验证图片是否存在
const varifyImageExist = async (ctx, next) => {
  const { id } = ctx.params
  const res = await imageService.getById(id)
  if (!res.length) {
    ctx.status = 404; // 设置状态码为404
    ctx.body = { message: "图片不存在" }; // 设置响应体为错误消息
    return;
  }

  await next()
}

module.exports = {
  varifyImage,
  varifyImageExist
}

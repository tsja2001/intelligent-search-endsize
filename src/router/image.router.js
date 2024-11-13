const KoadRouter = require('@koa/router')
const {
  varifyImage,
  varifyImageExist,
} = require('../middleware/image.middleware')
const imageController = require('../controller/image.controller')
const { default: koaBody } = require('koa-body')
const imageRouter = new KoadRouter({ prefix: '/images' })

// 新建家具-图片
imageRouter.post('/', varifyImage, imageController.create)

// 腾讯云对图片预签名
imageRouter.get('/presign', imageController.getPresign)

// 腾讯云上传图片
// imageRouter.post('/upload', imageController.upload)

// 查询图片列表
imageRouter.get('/:furniture_id', imageController.getList)

// 通过图片id删除图片
imageRouter.delete('/:id', varifyImageExist, imageController.remove)

// 通过图片id设置某张图片为排序第一
imageRouter.patch('/:id/first', varifyImageExist, imageController.setFirst)

// 客户端上传图片到此服务器, 此服务器将图片上传到腾讯云, 并返回图片的url
imageRouter.post('/upload', imageController.upload);

module.exports = imageRouter

const KoadRouter = require('@koa/router')
const sdRouter = new KoadRouter({ prefix: '/sd' })
const sdController = require('../controller/sd.controller')

// Inpaint修改
// data: {imageId: string, maskId: string, prompt:string}
sdRouter.post('/inpaint', sdController.inpaint)

// 搜索替换
// data: {imageId: string, select_prompt: string , prompt:string}
sdRouter.post('/search-and-recolor', sdController.searchAndRecolor)

// 搜索替换
// data: {imageId: string, select_prompt: string , prompt:string}
sdRouter.post('/structure', sdController.structure)

// sd
sdRouter.post('/generateSd3', sdController.generateSd3)

// sdUltra
sdRouter.post('/generateSdUltra', sdController.generateSdUltra)

// 风格
sdRouter.post('/style', sdController.style)

// 草图
sdRouter.post('/sketch', sdController.sketch)


module.exports = sdRouter

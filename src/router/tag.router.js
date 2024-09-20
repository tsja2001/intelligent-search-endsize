const KoadRouter = require('@koa/router')
const { varifyTag } = require('../middleware/tag.middleware')
const tagController = require('../controller/tag.controller')
const tagRouter = new KoadRouter({ prefix: '/tags' })
const { varifyAuth } = require('../middleware/login.middleware')

// 新建标签

// tagRouter.post('/', varifyTag, tagController.create)
tagRouter.post('/', tagController.create)

// 查询标签列表
// params: { name: string }
// tagRouter.get('/', varifyAuth, tagController.getList)
tagRouter.get('/', tagController.getList)

// 根据名字查询标签
// params: { name: string }
tagRouter.get('/name', tagController.getByName)


module.exports = tagRouter
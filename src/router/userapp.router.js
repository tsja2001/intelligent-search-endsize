const KoadRouter = require('@koa/router')
const userappController = require('../controller/userapp.controller')
const userappRouter = new KoadRouter({ prefix: '/userapp' })

// 新建记录
userappRouter.post('/', userappController.create)

// 查询标签列表
// params: { name: string }
// userappRouter.get('/', varifyAuth, tagController.getList)
// userappRouter.get('/', tagController.getList)

// 根据名字查询标签
// params: { name: string }
// userappRouter.get('/name', tagController.getByName)


module.exports = userappRouter

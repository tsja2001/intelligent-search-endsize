const KoadRouter = require('@koa/router')
const aiController = require('../controller/ai.controller')
const aiRouter = new KoadRouter({ prefix: '/ai' })

// 新建Ai记录
// tagRouter.post('/', varifyTag, tagController.create)
aiRouter.post('/', aiController.create)

// 创建Ai生成记录, 并生成图片
aiRouter.post('/recordAndGenerate', aiController.recordAndGenerate)

// 查询任务状态
aiRouter.get('/task/:taskId', aiController.getTaskStatus);

// 查询列表
aiRouter.get('/list', aiController.getList)

// 根据用户id获取Ai记录
aiRouter.get('/userid/:user_id', aiController.getListByUserId)

// 通过ID获取详情
aiRouter.get('/:id', aiController.getById)

// 更新Ai记录
aiRouter.patch('/:id', aiController.update)

// 删除Ai记录
aiRouter.delete('/:id', aiController.delete)



module.exports = aiRouter

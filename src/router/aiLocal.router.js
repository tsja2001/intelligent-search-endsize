const KoadRouter = require('@koa/router')
const aiLocalController = require('../controller/aiLocal.controller')
const aiLocalRouter = new KoadRouter({ prefix: '/aiLocal' })

// 新建Ai生成记录
aiLocalRouter.post('/recordAndGenerate', aiLocalController.recordAndGenerate)

// 查询列表
aiLocalRouter.get('/list', aiLocalController.getList)

// 查询任务列表
aiLocalRouter.get('/task/list', aiLocalController.getTaskList)

// 查询任务状态
aiLocalRouter.get('/task/:taskId', aiLocalController.getByTaskId)

module.exports = aiLocalRouter

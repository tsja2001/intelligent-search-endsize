const KoadRouter = require('@koa/router')

const localController = require('../controller/local.controller')
const localRouter = new KoadRouter({ prefix: '/local' })


// PC获取是否存在任务, 如果有返回一个待处理的任务
localRouter.get('/task', localController.getTask)

// PC提交任务结果
localRouter.post('/task/:taskId/result', localController.setResult)

module.exports = localRouter

const localService = require('../service/local.service')

class LocalController {
	// PC向服务器获取一个待处理的任务
  async getTask(ctx, next) {
    const task = localService.getTask()
    if (task) {
      ctx.body = {
        taskId: task.taskId,
        params: task.params
      }
    } else {
      ctx.body = null
    }
    await next()
  }

	// PC向服务器提交任务处理结果
  async setResult(ctx, next) {
    const { taskId } = ctx.params
    const { status = 'success', result } = ctx.request.body
    
    localService.updateTaskStatus(taskId, status, result)
    ctx.body = {
      message: 'success'
    }
    await next()
  }
}

module.exports = new LocalController()

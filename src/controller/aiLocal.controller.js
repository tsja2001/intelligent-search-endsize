// const aiLocalService = require('../service/aiLocal.service')
const aiService = require('../service/ai.service')
const localService = require('../service/local.service')
const { v4: uuidv4 } = require('uuid')
const translateService = require('../service/translate.service')

class AiLocalController {
  async create(ctx, next) {
    const body = ctx.request.body
    const res = await aiService.create(body)
    ctx.body = {
      message: '创建成功',
      data: res,
    }
  }
  async recordAndGenerate(ctx, next) {
    console.log('接收到请求', ctx.request.body)

    const body = ctx.request.body
    console.log('111')
    const taskId = uuidv4()
    console.log('222')

    // 翻译提示词
    // 1. 翻译提示词内容
    // const transRes = await translateService.translate({
    //   SourceText: body.prompt,
    // })

    // 1. 创建Ai记录
    // await aiService.create({
    //   ...body,
    //   transPrompt: transRes.TargetText,
    //   isLocal: true,
    //   status: 'pending',
    //   taskId,
    // })

    // 2. 加入队列, 等待生成图片
    localService.addTask({
      ...body,
      transPrompt: 'transRes.TargetText',
      // transPrompt: transRes.TargetText,
      isLocal: true,
      status: 'pending',
      taskId,
    }, taskId)

    ctx.body = {
      message: '任务已加入队列',
      taskId: taskId,
    }
  }

  async getList(ctx, next) {
    const res = await aiService.getList()
    ctx.body = {
      message: '查询成功',
      data: res,
    }
  }

  async getById(ctx, next) {
    const { taskId } = ctx.params
    const res = await aiService.getById(taskId)
    ctx.body = {
      message: '查询成功',
      data: res,
    }
  }

  async getByTaskId(ctx, next) {
    const { taskId } = ctx.params

		const task = localService.getTaskById(taskId)

    ctx.body = {
      message: '查询成功',
      data: task,
    }
  }

  async getTaskList(ctx, next) {
    const res = await localService.getTaskList()
    ctx.body = {
      message: '查询成功',
      data: res,
    }
  }
}

module.exports = new AiLocalController()

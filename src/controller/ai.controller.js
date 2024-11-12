const aiService = require('../service/ai.service')
const localService = require('../service/local.service')
const sdService = require('../service/sd.service')
const translateService = require('../service/translate.service')
const Queue = require('better-queue')
const { v4: uuidv4 } = require('uuid')

class AiController {
  taskStatus = null
  constructor() {
    this.queue = new Queue(this.processTask.bind(this), { concurrent: 5 })
    this.taskStatus = new Map()
  }
  // Existing create method
  async create(ctx, next) {
    const body = ctx.request.body
    const data = await aiService.create(body)
    // const res = await aiService.getById(insertId) // Ensure async operation completes
    ctx.body = {
      message: '创建成功',
      data,
    }
  }

  // 创建Ai生成记录, 并生成图片
  recordAndGenerate = async (ctx) => {
    const body = ctx.request.body
    const taskId = uuidv4()

    this.taskStatus.set(taskId, { status: 'pending' })

    this.queue.push({ taskId, body })

    console.log('recordAndGenerate 任务已加入队列', taskId)
    ctx.body = {
      message: '任务已加入队列',
      taskId: taskId,
    }
  }

  async processTask({ taskId, body }) {
    console.log('processTask执行任务 taskId', taskId)
    console.log('processTask执行任务 body', body)
    try {
      // 1. 翻译提示词内容
      const transRes = await translateService.translate({
        SourceText: body.prompt,
      })

      let generated_image_url = ''

      // 2. 开始请求图片
      console.log('开始请求图片, 调用sd API')

      // 如果调用本地服务
      if (body.isLocal) {
        console.log('调用本地服务')
        // 处理local
        const taskId = await localService.addTask({
          imageUrl: body.original_image_url,
          prompt: transRes.TargetText,
        })

        generated_image_url = 'taskId' + taskId


      } else {
        console.log('调用sd官方api')
        // 如果调用sd官方api
        switch (body.type) {
          // 装修
          case 'renovating':
            generated_image_url = await sdService.structure({
              imageUrl: body.original_image_url,
              prompt: transRes.TargetText,
            })
            break

          case 'replace':
            generated_image_url = await sdService.inpaint({
              imageUrl: body.original_image_url,
              maskUrl: body.mask_image_url,
              prompt: transRes.TargetText,
              grow_mask: body.grow_mask ?? 75,
            })
            break
          case 'recolor':
            const select_prompt_transRes = await translateService.translate({
              SourceText: body.select_prompt,
            })
            generated_image_url = await sdService.searchAndRecolor({
              imageUrl: body.original_image_url,
              maskUrl: body.mask_image_url,
              select_prompt: select_prompt_transRes.TargetText,
              prompt: transRes.TargetText,
              grow_mask: body.grow_mask ?? 20,
            })
            break
          case 'styleReplace':
            generated_image_url = await sdService.style({
              imageUrl: body.original_image_url,
              prompt: transRes.TargetText,
            })
            break
          default:
            break
        }
      }
      // 3. 创建ai生成记录
      console.log('创建ai生成记录')
      const res = await aiService.create({
        ...body,
        generated_image_url,
        user_id: body.user_id,
        transPrompt: transRes.TargetText,
      })

      this.taskStatus.set(taskId, { status: 'completed', data: res })
    } catch (error) {
      console.error('处理任务时出错:', error)
      this.taskStatus.set(taskId, { status: 'failed', error: error.message })
    }
  }

  getTaskStatus = async (ctx) => {
    const { taskId } = ctx.params
    const status = this.taskStatus.get(taskId)

    if (!status) {
      ctx.status = 404
      ctx.body = { message: '任务不存在' }
      return
    }

    ctx.body = status
  }

  // Get by ID method
  async getById(ctx) {
    const { id } = ctx.params
    const data = await aiService.getById(id)
    ctx.body = {
      message: '记录获取成功',
      data,
    }
  }

  // Update method
  async update(ctx) {
    const { id } = ctx.params
    const body = ctx.request.body
    const data = await aiService.update(id, body)
    ctx.body = {
      message: '记录更新成功',
      data,
    }
  }

  // Delete method
  async delete(ctx) {
    const { id } = ctx.params
    await aiService.delete(id)
    ctx.body = {
      message: '记录删除成功',
    }
  }

  // Get list by user ID method
  async getListByUserId(ctx) {
    let { user_id } = ctx.params
    // if (!user_id || user_id == 'undefined' || user_id == undefined) {
    //   user_id = 20
    // }
    let data = []
    if (user_id) {
      data = await aiService.getListByUserId(user_id)
    }

    ctx.body = {
      message: '用户记录获取成功',
      data,
    }
  }

  async getList(ctx) {
    const data = await aiService.getList()
    ctx.body = {
      message: '获取成功',
      data,
    }
  }
}

module.exports = new AiController()

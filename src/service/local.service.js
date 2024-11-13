/**
1. 实现边缘计算功能. 服务器有AI生图需求时, 将计算需求发送到PC上进行边缘计算.
2. PC调用本地的ComfyUI的API接口, 进行生图工作.
3. 服务器有公网IP, 本地PC没有. 暂时不使用WebSocket服务, PC使用HTTP定时请求, PC端每0.5s请求一次服务器.
4. 若服务器端有需要交给PC的工作, 则在PC定时请求时返回一个响应. 响应内容有任务参数, 任务ID.
5. PC接收到响应时, 任务加入生图队列中. 当生图任务完成时, 将生成结果以及任务ID, 返回给服务器.

	此代码为边缘计算服务器端代码
 */
const { v4: uuidv4 } = require('uuid')

class LocalService {
  /**
   * {
   *  taskId: "",
   *  params: {},
   *  status: 'pending | processing | completed',
   *  result: {},
   * }
   */
  tasks = []
  constructor() {}

  addTask(params, taskId) {
    console.log('addTask', params, taskId)
    this.tasks.push({
      taskId,
      params,
      status: 'pending',
      result: null,
    })
    return taskId
  }

  // 获取一个待处理的任务
  getTask() {
    const task = this.tasks.find(task => task.status === 'pending');
    if (task) {
      task.status = 'processing';
      return task;
    }
    return null;
  }


  updateTaskStatus(taskId, status, result) {
    // console.log('localService - updateTaskStatus', this.tasks.get(taskId))
    const task = this.tasks.find(task => task.taskId === taskId)
    if (task) {
      task.status = status
      task.result = result
    }
  }

  getTaskById(taskId) {
    // return this.tasks.get(taskId)
    return this.tasks.find(task => task.taskId === taskId) 
  }

  getTaskList() {
    return Array.from(this.tasks.values())
  }
}

module.exports = new LocalService()

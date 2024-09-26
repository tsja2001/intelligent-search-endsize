// const nodejieba = require('nodejieba')
const furnitureService = require('../service/furniture.service')
const imageService = require('../service/image.service')
const tagService = require('../service/tag.service')
const userService = require('../service/user.service')

class FurnitureController {
  async create(ctx, next) {
    const body = ctx.request.body
    const res = await furnitureService.create(body)
    // 3.查看存储结果, 告诉前端存储成功
    ctx.body = {
      message: '创建成功',
      data: {
        res: res,
      },
    }
  }

  async getList(ctx, next) {
    const { title, merchant_id } = ctx.query
    const res = await furnitureService.getList(title, merchant_id)
    for (let i = 0; i < res.length; i++) {
      // 查询图片
      const images = await imageService.getList(res[i].id)
      // 首图
      res[i].first_image = images[0]
      // 所有图片
      res[i].images = images
      // 查询商家
      const merchant = await userService.getUserInfoById(res[i].merchant_id)
      res[i].merchant = merchant
      // 查询标签
      const tags = await tagService.getListByFurnitureId(res[i].id)
      res[i].tags = tags
    }
    ctx.body = {
      message: '查询成功',
      data: res,
    }
  }

  async search(ctx, next) {
    const { content } = ctx.query

    // 分词
    // const result = nodejieba.cut(content)
    // const kw = nodejieba.extract(content, 5)
    // let result = kw.map((item) => item.word)
    console.log('content----', content)
    // console.log('result', result)
    // // TODO: 优化分词结果
    // if (!result || result.length === 0) {
    //   result = [content]
    // }

    const result = [content]
    const res = await furnitureService.searchByMultipleTags(result)

    for (let i = 0; i < res.length; i++) {
      // 2. 查询首图
      const images = await imageService.getList(res[i].id)
      res[i].first_image = images[0]
      // 查询商家
      const merchant = await userService.getUserInfoById(res[i].merchant_id)
      res[i].merchant = merchant
    }

    console.log('res', res)

    ctx.body = {
      message: '查询成功',
      data: res,
    }
  }

  async getById(ctx, next) {
    const id = ctx.params.id
    const [res] = await furnitureService.getById(id)
    const tags = await tagService.getListByFurnitureId(id)
    const images = await imageService.getList(id)

    ctx.body = {
      message: '查询成功',
      data: {
        tags: tags,
        images: images,
        ...res,
      },
    }
  }

  async update(ctx, next) {
    const id = ctx.params.id
    const body = ctx.request.body
    const res = await furnitureService.update(id, body)
    ctx.body = {
      message: '更新成功',
      data: res,
    }
  }

  async delete(ctx, next) {
    const id = ctx.params.id
    const res = await furnitureService.delete(id)
    ctx.body = {
      message: '删除成功',
      data: res,
    }
  }

  async addTags(ctx, next) {
    const { furniture_id } = ctx.params
    const { tag_id } = ctx.request.body
    const res = await furnitureService.addTags(furniture_id, tag_id)
    ctx.body = {
      message: '添加成功',
      data: res,
    }
  }

  // 新建家具, 并关联标签与图片
  async createComplete(ctx, next) {
    const body = ctx.request.body
    // 新建家具
    const res = await furnitureService.create(body)
    const furniture_id = res.insertId
    // 关联标签
    const { tag_ids } = body
    if (tag_ids && tag_ids.length > 0) {
      await furnitureService.addTags(furniture_id, tag_ids)
    }
    // 处理图片
    const { images } = body
    if (images && images.length > 0) {
      await imageService.createBatch(furniture_id, images)
    }

    ctx.body = {
      message: '创建成功',
      data: res,
    }
  }

  // 更新家具信息，并更新标签与图片
  async updateComplete(ctx) {
    const furniture_id = ctx.params.id
    const { title, description, status, tag_ids, images } = ctx.request.body

    // 更新家具信息
    await furnitureService.update(furniture_id, { title, description, status })

    // 更新标签关联
    // 先删除旧的关联
    await tagService.deleteByFurnitureId(furniture_id)
    // 添加新的关联
    if (tag_ids && tag_ids.length > 0) {
      await furnitureService.addTags(furniture_id, tag_ids)
    }

    // 更新图片信息
    // 先删除旧的图片
    await imageService.deleteByFurnitureId(furniture_id)
    // 添加新的图片
    if (images && images.length > 0) {
      await imageService.createBatch(furniture_id, images)
    }

    ctx.body = {
      message: '更新成功',
      data: { furniture_id },
    }
  }
}

module.exports = new FurnitureController()

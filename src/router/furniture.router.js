const KoadRouter = require('@koa/router')
const { varifyTag, varifyTagExist } = require('../middleware/tag.middleware')
const tagController = require('../controller/tag.controller')
const { varifyFurniture } = require('../middleware/furniture.middleware')
const furnitureService = require('../service/furniture.service')
const furnitureController = require('../controller/furniture.controller')
const furnitureRouter = new KoadRouter({ prefix: '/furnitures' })

// 新建家具
furnitureRouter.post('/', varifyFurniture, furnitureController.create)

// 新建家具, 并关联标签与图片
furnitureRouter.post('/complete', varifyFurniture, furnitureController.createComplete)

// 智能搜索
furnitureRouter.get('/search', furnitureController.search)

// 根据id查询家具详情
furnitureRouter.get('/:id', furnitureController.getById)

// 查询家具列表(所有列表/商家发布的家具列表)
// body: { title?, merchant_id? }
furnitureRouter.get('/', furnitureController.getList)

// 更新家具信息
// body: { title?, description?, status?: 'active' | 'inactive' }
furnitureRouter.patch('/:id', furnitureController.update)

// 更近家具信息, 并关联标签与图片
furnitureRouter.patch('/:id/complete', furnitureController.updateComplete)

// 删除家具
furnitureRouter.delete('/:id', furnitureController.delete)

// 关联家具和标签
// params: { furniture_id: number }
// body: { tag_id: [number] }
furnitureRouter.post('/:furniture_id/tags', varifyTagExist, furnitureController.addTags)


module.exports = furnitureRouter

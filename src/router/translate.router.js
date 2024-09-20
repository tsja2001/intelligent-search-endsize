const KoadRouter = require('@koa/router')
const translateController = require('../controller/translate.controller')
const translateRouter = new KoadRouter({ prefix: '/translate' })

// { SourceText: string, Source: 'zh' | 'en', Target: 'zh' | 'en' }
translateRouter.post('/', translateController.translate)

module.exports = translateRouter

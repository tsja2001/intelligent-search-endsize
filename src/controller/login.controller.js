const jwt = require('jsonwebtoken')
const { privateKey } = require('../config/screct')

class LoginController {
  async sign(ctx, next) {
    // 获取用户信息
    const { id, username } = ctx.user
    // 颁发token
    try {
      const token = jwt.sign({ id, username }, privateKey, {
        expiresIn: 60 * 60 * 24 * 7,
        algorithm: 'RS256',
      })

      console.log(token)
      // 返回用户信息
      ctx.body = {
        code: 0,
        data: {
          token,
          ...ctx.user,
          password: '',
        },
      }
    } catch (error) {
      console.log('error', error)
    }
  }
}

module.exports = new LoginController()

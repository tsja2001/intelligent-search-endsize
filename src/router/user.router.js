const KoadRouter = require('@koa/router')
const userController = require('../controller/user.controller')
const { varifyAuth } = require('../middleware/login.middleware')
const {
  verifyUser,
  handlePassword,
  verifyUserExist,
} = require('../middleware/user.middleware')

const userRouter = new KoadRouter({ prefix: '/users' })


// 注册用户
userRouter.post('/', verifyUser, handlePassword, userController.create)

// 查询用户列表
userRouter.get('/list', varifyAuth, userController.getUserList)

// 通过ID查找用户
userRouter.get('/:id', varifyAuth, userController.getUserInfoByID)

// 通过用户名查找用户
userRouter.get('/', varifyAuth, userController.getUserInfoByName)

// 注销用户
userRouter.delete(
  '/:id',
  varifyAuth,
  verifyUserExist,
  userController.deleteUserById
)

// 编辑用户信息
userRouter.patch(
	'/:id',
	varifyAuth,
	verifyUserExist,
	userController.updateUserById
)

module.exports = userRouter

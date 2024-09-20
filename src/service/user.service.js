const { connection } = require('../app/database')
const md5password = require('../utils/md5-password')

class UserService {
  async create(user) {
    const { username, password, role = 'user' } = user

    const statement =
      'INSERT INTO `Users` (username, password, role)VALUES (?,?, ?)'

    const [result] = await connection.execute(statement, [
      username,
      password,
      role,
    ])

    return result
  }
  async findUserByName(username) {
    const statement = 'SELECT * FROM Users WHERE username=?'

    const [result] = await connection.execute(statement, [username])

    return result
  }
  async getUserInfoById(id) {
    const statement = `SELECT * FROM Users WHERE id = ?`

    const [result] = await connection.execute(statement, [id])

    return result?.[0]
  }

  async deleteUserById(id) {
    const statement = `DELETE FROM Users WHERE id = ?`

    const [result] = await connection.execute(statement, [id])

    return result
  }

  async updateUserById(id, username, role, password) {
    const statement = `
    UPDATE Users
    SET username = ?, role = ?, password = ?
    WHERE id = ?
    `

    console.log('statement', statement)
    console.log('id', id)
    console.log('username', username)
    console.log('role', role)
    console.log('password', password)

    const [result] = await connection.execute(statement, [
      username,
      role,
      password,
      id,
    ])

    return result
  }

  async getUserList(offset, size, username) {
    let statement = `
    SELECT 
      *
    FROM
      Users
    `
    const params = []

    if (username) {
      statement += `WHERE username LIKE ? `
      params.push(`%${username}%`)
    }

    statement += `LIMIT ?, ?`
    params.push(offset, size)

    const [result] = await connection.execute(statement, params)
    return result
  }
}

module.exports = new UserService()

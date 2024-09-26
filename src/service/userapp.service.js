const { connection } = require('../app/database')
const md5password = require('../utils/md5-password')

class UserappService {
  async create(body) {
    const { openid, device_model, system_version } = body

    const statement =
      'INSERT INTO User_app_open (openid, device_model, system_version)VALUES (?, ?, ?)'

    const [result] = await connection.execute(statement, [
      openid,
      device_model,
      system_version,
    ])

    return result
  }

  async getList(name) {
    let statement = `SELECT * FROM Tags WHERE name LIKE ? ORDER BY CASE WHEN name = ? THEN 0 ELSE 1 END, name`
    console.log('Searching for name:', name)
    const [result] = await connection.execute(statement, [`%${name}%`, name])
    return result
  }

  async getByName(name) {
    let statement = `SELECT * FROM Tags WHERE name=?`

    const [result] = await connection.execute(statement, [name])

    return result
  }
  // 通过furniture_id获取标签列表
  async getListByFurnitureId(furniture_id) {
    const statement = `SELECT t.id, t.name FROM Tags t
    LEFT JOIN Furniture_Tags ft ON t.id = ft.tag_id
    WHERE ft.furniture_id = ?`

    const [result] = await connection.execute(statement, [furniture_id])

    return result
  }

  // 通过furniture_id删除标签
  async deleteByFurnitureId(furniture_id) {
    const statement = `DELETE FROM Furniture_Tags WHERE furniture_id = ?`

    const [result] = await connection.execute(statement, [furniture_id])

    return result
  }
}

module.exports = new UserappService()

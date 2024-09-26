const { connection } = require('../app/database')

class furnitureService {
  async create(body) {
    const { merchant_id, title, description = '' } = body

    console.log('body', body)
    const statement = `INSERT INTO Furniture_Items (merchant_id, title, description) VALUES (?, ?, ?)`

    const [result] = await connection.execute(statement, [
      merchant_id,
      title,
      description,
    ])

    return result
  }
  async getList(title, merchant_id) {
    // 根据是否传入merchant_id构建查询语句
    let statement = `SELECT * FROM Furniture_Items WHERE title LIKE ?`
    let params = [`%${title}%`]

    if (merchant_id) {
      statement += ` AND merchant_id = ?`
      params.push(merchant_id)
    }

    // 执行查询语句
    const [result] = await connection.execute(statement, params)

    return result
  }

  async getById(id) {
    const statement = `SELECT * FROM Furniture_Items WHERE id = ?`
    const [result] = await connection.execute(statement, [id])
    return result
  }

  async update(id, body) {
    const { title, description, status } = body
    const updates = []
    const params = []

    // 根据传入的body动态构建SQL语句和参数数组
    if (title) {
      updates.push(`title = ?`)
      params.push(title)
    }
    if (description) {
      updates.push(`description = ?`)
      params.push(description)
    }
    if (status) {
      updates.push(`status = ?`)
      params.push(status)
    }

    // 如果没有任何内容需要更新，则直接返回
    if (updates.length === 0) {
      return
    }

    // 构建完整的SQL语句
    const statement = `UPDATE Furniture_Items SET ${updates.join(
      ', '
    )} WHERE id = ?`
    params.push(id)

    try {
      const [result] = await connection.execute(statement, params)
      return result
    } catch (error) {
      // 错误处理，可以根据你的需要记录日志或者抛出异常
      console.error('Update failed:', error)
      throw error
    }
  }

  async delete(id) {
    // 删除所有与家具项相关的图片
    const deleteImages = 'DELETE FROM Furniture_Images WHERE furniture_id = ?'
    // 删除所有与家具项相关的标签关联
    const deleteTags = 'DELETE FROM Furniture_Tags WHERE furniture_id = ?'
    // 删除家具项本身
    const deleteItem = 'DELETE FROM Furniture_Items WHERE id = ?'

    // 执行删除操作
    await connection.execute(deleteImages, [id])
    await connection.execute(deleteTags, [id])
    const [result] = await connection.execute(deleteItem, [id])

    return result
  }

  async addTags(furniture_id, tag_ids) {
    // 准备SQL语句进行批量插入
    const values = tag_ids
      .map((tag_id) => `(${furniture_id}, ${tag_id})`)
      .join(', ')
    const statement = `INSERT INTO Furniture_Tags (furniture_id, tag_id) VALUES ${values}`

    // 执行SQL语句
    const [result] = await connection.execute(statement)
    return result
  }

  async searchByMultipleTags(tags) {
    // 构建基于标签的模糊查询部分
    let tagsConditions = tags.map((tag) => `Tags.name LIKE ?`).join(' OR ')

    console.log('tags--------------', tags)

    // SQL 查询语句，联合三个表进行查询，并计算匹配标签数量
    // let statement = `
    //   SELECT Furniture_Items.*, COUNT(DISTINCT Tags.id) as relevance
    //   FROM Furniture_Items
    //   JOIN Furniture_Tags ON Furniture_Items.id = Furniture_Tags.furniture_id
    //   JOIN Tags ON Furniture_Tags.tag_id = Tags.id
    //   WHERE ${tagsConditions}
    //   GROUP BY Furniture_Items.id
    //   ORDER BY relevance DESC, Furniture_Items.updated_at DESC
    // `

    let statement = `
      SELECT *
      FROM Furniture_Items
      JOIN Furniture_Tags ON Furniture_Items.id = Furniture_Tags.furniture_id
      JOIN Tags ON Furniture_Tags.tag_id = Tags.id
      WHERE Tags.name LIKE ? 
    `

    // 处理标签数组，为每个标签添加模糊搜索的通配符
    // let params = tags.map((tag) => `%${tag}%`)

    const tag = `%${tags[0].trim()}%`
    // 执行查询
    const [result] = await connection.execute(statement, [tag])

    return result
  }

  // async searchByMultipleTags(tags) {

  //   console.log(tags)

  //   // 构建基于标签的模糊查询部分
  //   let tagsConditions = tags.map((tag) => `Tags.name LIKE ?`).join(' OR ')

  //   // SQL 查询语句，联合三个表进行查询
  //   let statement = `
  //     SELECT DISTINCT Furniture_Items.*
  //     FROM Furniture_Items
  //     JOIN Furniture_Tags ON Furniture_Items.id = Furniture_Tags.furniture_id
  //     JOIN Tags ON Furniture_Tags.tag_id = Tags.id
  //     WHERE ${tagsConditions}
  //   `

  //   // 处理标签数组，为每个标签添加模糊搜索的通配符
  //   let params = tags.map((tag) => `%${tag}%`)

  //   // 执行查询
  //   const [result] = await connection.execute(statement, params)

  //   return result
  // }
}

module.exports = new furnitureService()

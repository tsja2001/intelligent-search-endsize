const { default: axios } = require('axios')
const { connection } = require('../app/database')
const COS = require('cos-nodejs-sdk-v5')

const { SecretId, SecretKey } = process.env;

class ImageService {
  async create(body) {
    const { furniture_id, image_url, order } = body

    //需要检查当前最大的order是多少
    const orderStatement = `SELECT COALESCE(MAX(\`order\`), 0) + 1 as next_order FROM Furniture_Images WHERE furniture_id = ?`
    const [orderResult] = await connection.execute(orderStatement, [
      furniture_id,
    ])
    const nextOrder = order !== undefined ? order : orderResult[0].next_order

    // 现在插入新的图片数据
    const createStatement = `INSERT INTO Furniture_Images (furniture_id, image_url, \`order\`) VALUES (?, ?, ?)`
    const [result] = await connection.execute(createStatement, [
      furniture_id,
      image_url,
      nextOrder,
    ])

    return result
  }

  // 批量创建图片
  async createBatch(furniture_id, images) {
    const createPromises = images.map(async (image_url, index) => {
      const createStatement = `INSERT INTO Furniture_Images (furniture_id, image_url, \`order\`) VALUES (?, ?, ?)`
      const [result] = await connection.execute(createStatement, [
        furniture_id,
        image_url,
        index + 1, // 使用索引作为order
      ])
      return result
    })

    const results = await Promise.all(createPromises)
    return results
  }

  async update(image_id, body) {
    const { image_url, order } = body

    let updates = []
    if (image_url !== undefined) updates.push(`image_url = '${image_url}'`)
    if (order !== undefined) updates.push(`\`order\` = ${order}`)

    if (updates.length === 0) {
      throw new Error('No valid fields provided for update')
    }

    const updateStatement = `UPDATE Furniture_Images SET ${updates.join(
      ', '
    )} WHERE id = ?`
    const [result] = await connection.execute(updateStatement, [image_id])

    return result
  }
  async getList(furniture_id) {
    // 准备 SQL 查询语句，用于检索并按 `order` 字段排序的图片
    const query = `SELECT * FROM Furniture_Images WHERE furniture_id = ? ORDER BY \`order\``

    // 执行查询并获取结果
    const [rows] = await connection.execute(query, [furniture_id])

    // 返回查询结果
    return rows
  }

  async remove(image_id) {
    const statement = `DELETE FROM Furniture_Images WHERE id = ?`
    const [result] = await connection.execute(statement, [image_id])

    return result
  }

  async getById(image_id) {
    const statement = `SELECT * FROM Furniture_Images WHERE id = ?`
    const [result] = await connection.execute(statement, [image_id])

    return result
  }

  async setFirst(image_id) {
    // 1. 找到当前图片的furniture_id
    const statement = `SELECT furniture_id FROM Furniture_Images WHERE id = ?`
    const [result] = await connection.execute(statement, [image_id])
    const furniture_id = result[0].furniture_id

    // 2. 获取同一家具下所有图片并按order排序
    const images = await this.getList(furniture_id)

    // 3. 重新排列order，确保传入的image_id为第一个
    let newOrder = 1
    const updatePromises = images.map((image) => {
      if (image.id === Number(image_id)) {
        // 设置为第一位
        return connection.execute(
          `UPDATE Furniture_Images SET \`order\` = ? WHERE id = ?`,
          [0, image_id]
        )
      } else {
        // 其余图片order依次增加
        let currentOrder = newOrder++
        return connection.execute(
          `UPDATE Furniture_Images SET \`order\` = ? WHERE id = ?`,
          [currentOrder, image.id]
        )
      }
    })

    // 4. 执行所有更新操作
    await Promise.all(updatePromises)

    return true
  }

  // 通过furniture_id删除图片
  deleteByFurnitureId(furniture_id) {
    const statement = `DELETE FROM Furniture_Images WHERE furniture_id = ?`
    return connection.execute(statement, [furniture_id])
  }

  // 根据图片id, 获取图片文件流(用于sd服务)
  async getImageBuffer(image_id) {
    const statement = `SELECT * FROM Furniture_Images WHERE id = ?`
    const [result] = await connection.execute(statement, [image_id])

    if (result.length === 0) {
      throw new Error('IMAGE_NOT_FOUND')
    }

    const imgUrl = result[0].image_url

    const res = await this.getImageBufferByURL(imgUrl)

    return res
  }

  // 根据图片URL, 获取文件流(用于sd服务)
  async getImageBufferByURL(imgUrl) {
    try {
      // 发送 GET 请求并等待响应
      const response = await axios.get(imgUrl, { responseType: 'arraybuffer' })

      // 将响应数据转换为 Buffer
      const imageBuffer = Buffer.from(response.data, 'binary')

      console.log('图片数据已读取')
      return imageBuffer // 返回图片数据
    } catch (error) {
      console.error('图片读取出错: ', imgUrl, error.message)
      throw error // 如果出错，抛出错误以便在调用时处理
    }
  }

  // 预签名
  async getPresign() {
    const cos = new COS({
      SecretId: SecretId, // 替换为您的 SecretId
      SecretKey: SecretKey, // 替换为您的 SecretKey
      Region: 'ap-beijing',
    })

    // const filename = 'up2.png'
    const now = Date.now()
    const filename = now + '.png' // 使用当前时间戳作为文件名

    const key = filename // 指定上传文件在COS上的路径和文件名
    const method = 'PUT' // 请求方法，上传文件使用PUT

    const base = `${'tsja-1312706276'}.cos.${'ap-beijing'}.myqcloud.com`

    const imgurl = `https://${base}/${encodeURIComponent(key)}`

    // Expires 时间为当前时间加上有效时长（秒）
    const expiredTime = Math.floor(Date.now() / 1000) + 60 * 60

    const auth = cos.getAuth({
      Method: method,
      Key: key,
      Expires: expiredTime,
    })

    const uploadUrl = `${imgurl}?${auth}`

    // 开发用, 解决web端跨域,
    const devUrl = `/${encodeURIComponent(key)}/${auth}`

    return {
      uploadUrl,
      devUrl,
      imgurl,
      filename: now,
    }
  }

  // 上传图片到腾讯云
  async uploadImageToTencentCloud(imageBuffer) {
    const cos = new COS({
      SecretId: SecretId, // 替换为您的 SecretId
      SecretKey: SecretKey, // 替换为您的 SecretKey
    })

    const now = Date.now()
    const bucketName = 'tsja-1312706276'
    const region = 'ap-beijing'
    const key = now + '.png'

    await cos.putObject({
      Bucket: bucketName,
      Region: region,
      Key: key,
      Body: imageBuffer,
      ContentType: 'image/png',
    })

    const imgUrl = `https://${bucketName}.cos.${region}.myqcloud.com/${key}`

    return imgUrl
  }
}

module.exports = new ImageService()

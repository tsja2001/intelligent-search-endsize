const { connection } = require('../app/database')

class AiService {
  // Existing create method
  async create(body) {
    console.log('AiService body', body)
    const {
      user_id,
      type,
      original_image_url,
      mask_image_url,
      generated_image_url,
      prompt,
      transPrompt,
    } = body
    const statement =
      'INSERT INTO AI_Image_Generation_Records (user_id, type, original_image_url, mask_image_url, generated_image_url, prompt, transPrompt) VALUES (?, ?, ?, ?, ?, ?, ?)'
    const [result] = await connection.execute(statement, [
      user_id,
      type,
      original_image_url,
      mask_image_url,
      generated_image_url,
      prompt,
      transPrompt,
    ])

    return this.getById(result.insertId)
  }

  // Get by ID method
  async getById(id) {
    const statement = 'SELECT * FROM AI_Image_Generation_Records WHERE id = ?'
    const [rows] = await connection.execute(statement, [id])
    return rows[0] // Assuming ID is unique and either returns one record or none
  }

  // Update method
  async update(id, body) {
    const {
      user_id,
      type,
      original_image_url,
      mask_image_url,
      generated_image_url,
      prompt,
      transPrompt,
    } = body
    const statement =
      'UPDATE AI_Image_Generation_Records SET user_id = ?, type = ?, original_image_url = ?, mask_image_url = ?, generated_image_url = ?, prompt = ?, transPrompt = ? WHERE id = ?'
    const [result] = await connection.execute(statement, [
      user_id,
      type,
      original_image_url,
      mask_image_url,
      generated_image_url,
      prompt,
      transPrompt,
      id,
    ])
    return this.getById(id) // Return the updated record
  }

  // Delete method
  async delete(id) {
    const statement = 'DELETE FROM AI_Image_Generation_Records WHERE id = ?'
    const [result] = await connection.execute(statement, [id])
    return result
  }

  async getListByUserId(user_id) {
    const statement =
      'SELECT * FROM AI_Image_Generation_Records WHERE user_id = ? ORDER BY created_at DESC;'
    const [rows] = await connection.execute(statement, [user_id])
    return rows // Returns an array of records
  }

  async getList() {
    const statement = 'SELECT * FROM AI_Image_Generation_Records'
    const [rows] = await connection.execute(statement)
    return rows // Returns an array of records
  }
}

module.exports = new AiService()

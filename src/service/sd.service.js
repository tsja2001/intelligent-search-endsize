const fs = require('node:fs')
const axios = require('axios')
const FormData = require('form-data')
const { connection } = require('../app/database')
const { getImageBuffer, uploadImageToTencentCloud } = require('./image.service')
const imageService = require('./image.service')

class SdService {
  async inpaint(body) {
    // const { imageId, maskId, prompt } = body
    const { imageUrl, maskUrl, prompt, grow_mask = 75 } = body

    console.log('inpaint, body', body)

    const imgBuffer = await imageService.getImageBufferByURL(imageUrl)
    const maskBuffer = await imageService.getImageBufferByURL(maskUrl)

    const formData = new FormData()
    formData.append('image', imgBuffer, {
      filename: 'image.png',
      contentType: 'image/png',
    })
    formData.append('mask', maskBuffer, {
      filename: 'mask.png',
      contentType: 'image/png',
    })
    formData.append('prompt', prompt)
    formData.append('output_format', 'png')
    formData.append('grow_mask', grow_mask)

    const res = await postfrom('edit/inpaint', formData)

    return res
  }

  async searchAndRecolor(body) {
    console.log('searchAndRecolor body', body)

    const { imageId, imageUrl, prompt, select_prompt, grow_mask } = body

    const imgBuffer = await imageService.getImageBufferByURL(imageUrl)

    const formData = new FormData()
    formData.append('image', imgBuffer, {
      filename: 'image.png',
      contentType: 'image/png',
    })
    formData.append('prompt', prompt)
    formData.append('select_prompt', select_prompt)
    formData.append('grow_mask', grow_mask)
    formData.append('output_format', 'png')

    const res = await postfrom('edit/search-and-recolor', formData)

    return res
  }

  async structure(body) {
    // control_strengt 0-1 越大影响越大
    const { imageId, imageUrl, prompt, control_strength = 0.7 } = body

    const imgBuffer = await imageService.getImageBufferByURL(imageUrl)

    console.log('structure, body', body)

    const formData = new FormData()
    formData.append('image', imgBuffer, {
      filename: 'image.png',
      contentType: 'image/png',
    })
    formData.append('prompt', prompt)
    formData.append('output_format', 'png')
    formData.append('control_strength', control_strength)

    const res = await postfrom('control/structure', formData)

    return res
  }
  async style(body) {
    const { imageId, imageUrl, prompt, fidelity = 0.2 } = body

    const imgBuffer = await imageService.getImageBufferByURL(imageUrl)

    const formData = new FormData()
    formData.append('image', imgBuffer, {
      filename: 'image.png',
      contentType: 'image/png',
    })
    formData.append('prompt', prompt)
    formData.append('output_format', 'png')
    formData.append('fidelity', fidelity)

    console.log('fidelity', fidelity)
    console.log('prompt', prompt)
    const res = await postfrom('control/style', formData)

    return res
  }

  async sketch(body) {
    const { imageId, imageUrl, prompt, control_strength = 0.6 } = body

    const imgBuffer = await imageService.getImageBufferByURL(imageUrl)

    const formData = new FormData()
    formData.append('image', imgBuffer, {
      filename: 'image.png',
      contentType: 'image/png',
    })
    formData.append('prompt', prompt)
    formData.append('output_format', 'png')
    formData.append('control_strength', control_strength)

    const res = await postfrom('control/sketch', formData)

    return res
  }

  async generateSd3(body) {
    const {
      imageId,
      imageUrl,
      prompt,
      strength = 0.7,
      mode = 'image-to-image',
    } = body

    // const imgBuffer = await imageService.getImageBuffer(imageId)
    const imgBuffer = await imageService.getImageBufferByURL(imageUrl)

    const formData = new FormData()
    formData.append('image', imgBuffer, {
      filename: 'image.png',
      contentType: 'image/png',
    })
    formData.append('prompt', prompt)
    formData.append('strength', strength)
    formData.append('mode', mode)
    formData.append('output_format', 'png')
    formData.append('model', 'sd3-large')

    const res = await postfrom('generate/sd3', formData)

    return res
  }

  // 文生图 未经过测试
  async generateSdUltra(body) {
    const { prompt } = body

    const imgBuffer = await imageService.getImageBuffer(imageId)

    const formData = new FormData()
    formData.append('image', imgBuffer, {
      filename: 'image.png',
      contentType: 'image/png',
    })
    formData.append('prompt', prompt)
    formData.append('output_format', 'png')

    const res = await postfrom('generate/ultra', formData)

    return res
  }
}

const postfrom = async (uri, formData) => {
  const { SD_TOKEN } = process.env

  try {
    const response = await axios.post(
      `https://api.stability.ai/v2beta/stable-image/${uri}`,
      formData,
      {
        responseType: 'arraybuffer',
        headers: {
          ...formData.getHeaders(),
          Authorization: `Bearer ${SD_TOKEN}`,
          Accept: 'image/*',
        },
      }
    )

    // console.log('response', response)

    if (response.status === 200) {
      const imageBuffer = Buffer.from(response.data) // 正确转换格式
      const imgUrl = await uploadImageToTencentCloud(imageBuffer)
      // const filename = Date.now() + '.webp'
      // fs.writeFileSync('./' + filename, Buffer.from(imageBuffer))
      return imgUrl
    } else {
      throw new Error(`${response.status}: ${imageBuffer.toString()}`)
    }
  } catch (error) {
    console.error('图片处理出错', error)
    throw error
  }
}

module.exports = new SdService()

const tencentcloud = require('tencentcloud-sdk-nodejs-tmt')

class TranslateService {
  async translate(body) {
    const { SourceText, Source = 'zh', Target = 'en' } = body
    const { SecretId, SecretKey } = process.env;

    const TmtClient = tencentcloud.tmt.v20180321.Client

    const clientConfig = {
      credential: {
        secretId: SecretId,
        secretKey: SecretKey,
      },
      region: 'ap-beijing',
      profile: {
        httpProfile: {
          endpoint: 'tmt.tencentcloudapi.com',
        },
      },
    }

    // 实例化要请求产品的client对象,clientProfile是可选的
    const client = new TmtClient(clientConfig)
    const params = {
      SourceText,
      Source,
      Target,
      ProjectId: 0,
    }
    const res = await client.TextTranslate(params) 

    return res
  }
}

module.exports = new TranslateService()

const rq = require('request-promise')
//
/**
 * 获取百度ai AccessToken
 */
exports.main = async(event, context) => {
  let apiKey = 'rcaTYoO3eTGgn19MO9VezPiy',
    grantType = 'client_credentials',
    secretKey = '1WeHukKN8B5ulx0apPr1FLWuuXCuqyZb',
    url = `https://aip.baidubce.com/oauth/2.0/token`
  /* LMJ
  AppID='17321732'
  APIKey='rcaTYoO3eTGgn19MO9VezPiy'
  secretKey='1WeHukKN8B5ulx0apPr1FLWuuXCuqyZb'
   */
  /* Mine
  AppID='16803143'
  APIKey='2ypFOy3OTtK6QC8nG6SptEv1'
  secretKey='tPPTP0m1cRxK1aXxEe3x206VtbuLF2Kb'
   */
  return new Promise(async(resolve, reject) => {
    try {
      let data = await rq({
        method: 'POST',
        url,
        form: {
          "grant_type": grantType,
          "client_secret": secretKey,
          "client_id": apiKey
        },
        json: true
      })
      resolve({
        code: 0,
        data,
        info: '操作成功！'
      })
    } catch (error) {
      console.log(error)
      if (!error.code) reject(error)
      resolve(error)
    }
  })
}

import getConfig from 'next/config'
import _ from 'lodash'

export const getLocalApiPrefix = () => {
  const nextConfig = getConfig()
  const { publicRuntimeConfig } = nextConfig
  const { protocol, host, port } = publicRuntimeConfig
  const localApiPrefix = protocol + '://' + host + ':' + port
  // console.log('localApiPrefix', localApiPrefix)
  return localApiPrefix
}

export const handleXSS = (content: string) => {
  content = content || ''
  return content.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\"/g, '&quot;').replace(/\'/g, '&#x27;')
}

export const checkModalObj = (modalObj: {}, ignoreKeys: any = []) => {
  let result: any = null
  _.each(modalObj, (value: any, key: string) => {
    // console.log('checkModalObj', ignoreKeys, key, ignoreKeys.join('.').indexOf(key))
    if (ignoreKeys.length === 0 || (ignoreKeys.length !== 0 && ignoreKeys.join('.').indexOf(key) === -1)) {
      if (_.trim(value) === '') {
        result = {
          key,
          reason: '不能为空'
        }
        return false
      }
    }
  })
  return result
}

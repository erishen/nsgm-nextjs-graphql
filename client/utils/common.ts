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

export const handleUserInput = (content: string) => { 
  content = content || ''
  return content.replace(/\"/g, "'").replace(/\\/g, "\\\\")
}

export const routerPush = (router: any, path: string) => { 
  const nextConfig = getConfig()
  const { publicRuntimeConfig } = nextConfig
  const { prefix } = publicRuntimeConfig

  if (router) { 
    if (typeof window != 'undefined') { 
      const locationHref = window.location.href

      if (path.indexOf('/') != -1) {
        if (locationHref.indexOf(prefix) == -1) {
          router.push(path)
        } else {
          router.push(prefix + path)
        }
      } else { 
        router.push(path)
      }
    }
  }
}

export const getNewLink = (link: string) => { 
  const nextConfig = getConfig()
  const { publicRuntimeConfig } = nextConfig
  const { prefix } = publicRuntimeConfig

  let newLink = link
  if (typeof window != 'undefined') { 
    const locationHref = window.location.href

    if (locationHref.indexOf(prefix) != -1) {
      newLink = newLink.replace(prefix, '')
      newLink = prefix + newLink
    } 
  }
  return newLink
}
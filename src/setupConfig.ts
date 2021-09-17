import * as _ from 'lodash'
let rootPath = ''
//@ts-ignore
import vuefrontDefaultConfig from 'vuefront'

const mergeConfig = (objValue: VueFrontConfig, srcValue: VueFrontConfig, index: string): VueFrontConfig => {
  if(index !== 'locales') {
    if (_.isArray(objValue)) {
      return _.concat(objValue, srcValue) as VueFrontConfig
    } else if (_.isObject(objValue)) {
      return _.merge(objValue, srcValue)
    } else {
      return srcValue
    }
  } else if(_.includes(['atoms', 'layouts', 'molecules', 'organisms', 'extensions'], index)) {
    if (_.isArray(objValue)) {
      return _.concat(objValue, srcValue) as VueFrontConfig
    } else if (_.isObject(objValue)) {
      return _.merge(objValue, srcValue)
    } else {
      return srcValue
    }
   } else {
    return _.mergeWith(objValue, srcValue, mergeConfig)
  }
}

const checkPath = (path: string) => {
  const newPath = _.replace(path, /^(~)/, rootPath + '/src')
  try {
    require.resolve(newPath)
    return true
  } catch (e) {
    return false
   }
}

const convertComponentPath = (items: VueFrontComponentList, root: string) => {
  let result: VueFrontComponentList = {}
  if(!items) {
    return
  }
  const category = items
  for(const key in category) {
    let component = undefined
    let css = undefined
    if (typeof category[key] === 'string') {
      component = category[key] as string
    } else {
      css = (category[key] as VueFrontComponent).css
      component = (category[key] as VueFrontComponent).component
    }
    let compResult: VueFrontComponent = {}

    if (!_.isUndefined(component)) {
      if(checkPath(component)) {
        compResult = {
          type: 'full',
          path: component
        }
      } else if(checkPath(root + '/' +component)) {
        compResult = {
          type: 'full',
          path: root + '/' +component,
        }
      } else {
        compResult = {
          type: 'inside',
          path: root,
          component,
        }
      }
    }
    if (!_.isUndefined(css)) {
      if(checkPath(css)) {
        compResult = {
          ...compResult,
          css
        }
      } else if(checkPath(root + '/' +css)) {
        compResult = {
          ...compResult,
          css: root + '/' +css,
        }
      }
    }
    result[key] = compResult
  }
  return result
}

const convertPath = (config: VueFrontConfig): VueFrontConfig => {
  const result: VueFrontConfig = {}

  if (config.atoms) {
    result.atoms = convertComponentPath(config.atoms as VueFrontComponentList, config.root?.components || '')
  }
  if (config.molecules) {
    result.molecules = convertComponentPath(config.molecules as VueFrontComponentList, config.root?.components || '')
  }
  if (config.organisms) {
    result.organisms = convertComponentPath(config.organisms as VueFrontComponentList, config.root?.components || '')
  }
  if (config.templates) {
    result.templates = convertComponentPath(config.templates as VueFrontComponentList, config.root?.components || '')
  }
  if (config.pages) {
    result.pages = convertComponentPath(config.pages as VueFrontComponentList, config.root?.components || '')
  }
  if (config.loaders) {
    result.loaders = convertComponentPath(config.loaders as VueFrontComponentList, config.root?.components || '')
  }
  if (config.extensions) {
    result.extensions = convertComponentPath(config.extensions as VueFrontComponentList, config.root?.components || '')
  }

  if(config.store) {
    result.store = {}
    for (const key in config.store) {
      let storeResult: VuefrontStore = config.store[key]
      if (_.isArray(storeResult.path)) {
        storeResult.path = storeResult.path.join('|modules|').split('|')
      }
      if(!config.store[key].module) {
        storeResult = config.store[key]
      } else {
        if (typeof config.store[key].module === 'string' ) {
          if(checkPath(config.store[key].module as string)) {
            storeResult.module = {              
              type: 'full',
              path: config.store[key].module as string
            }
          } else if (checkPath(config?.root?.store + '/' + config.store[key].module)) {
            storeResult.module = {
              type: 'full',
              path: config?.root?.store + '/' + config.store[key].module
            }
          } else {
            storeResult.module = {
              type: 'inside',
              path: config?.root?.store || '',
              component: config.store[key].module as string
            }
          }
        }
        
      }
      let storeKey: string = ''
      if (_.isArray(storeResult.path)) {
        storeKey = storeResult.path.map(val => (_.capitalize(val))).join('')
      }
      if (_.isString(storeResult?.path)) {
        storeKey = storeResult.path
      }
      if (result.store) {
        result.store[storeKey] = storeResult
      }
    }
  }

  if(config.locales) {
    result.locales = {}
    for (const key in config.locales) {
      result.locales[key] = []
      const locale = config.locales[key]
      for (const key2 in locale) {
        const locale2 = locale[key2]
        if (typeof locale2 === 'string') {
          if(checkPath(locale2 as string)) {
            result.locales[key].push({
              type: 'full',
              path: locale2 as string
            })
          } else if (checkPath(config?.root?.locales + '/' + locale2)) {
            result.locales[key].push({
              type: 'full',
              path: config?.root?.locales + '/' + (locale2 as string)
            })
          } else {
            result.locales[key].push({
              type: 'inside',
              path: config.root?.locales || '',
              component: locale2 as string
            })
          }
        }
      }
    }
  }

  return result
}

const cloneConfig = (config: VueFrontConfig): VueFrontConfig => {
  return JSON.parse(JSON.stringify(config))
}

export default (rootDir: string): VueFrontConfig => {
  let themeOptions: VueFrontConfig = {}
  themeOptions = cloneConfig(vuefrontDefaultConfig)
  rootPath = rootDir

  themeOptions = {...themeOptions,...convertPath(vuefrontDefaultConfig)}
  delete require.cache[require.resolve(rootDir + '/vuefront.config')]
  const themeConfig = require(rootDir + '/vuefront.config')
  let config = cloneConfig(themeConfig)
  config = {...config, ...convertPath(config)}
  if (typeof config.app !== 'undefined') {
    for(const key in config.app) {
      delete require.cache[require.resolve(config.app[key])]
      let customAppConfig = require(config.app[key])
      customAppConfig = customAppConfig.default || customAppConfig
      let customAppOptions = cloneConfig(customAppConfig)
      customAppOptions = {...customAppOptions, ...convertPath(customAppOptions)}
      themeOptions = _.mergeWith(themeOptions, customAppOptions, mergeConfig)
    }
  }

  if (typeof config.theme !== 'undefined') {
    delete require.cache[require.resolve(config.theme)]
    const customThemeConfig = require(config.theme).default
    let customThemeOptions = cloneConfig(customThemeConfig)
    customThemeOptions = {...customThemeOptions, ...convertPath(customThemeOptions)}
    themeOptions = _.mergeWith(themeOptions, customThemeOptions, mergeConfig)
  }
  themeOptions = _.mergeWith(themeOptions, config, mergeConfig)

  return themeOptions

}
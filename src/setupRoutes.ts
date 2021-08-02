import * as _ from 'lodash'
const convertComponent = (component, config) => {
  if (config.pages[component].type === 'full') {
    return `import('${config.pages[component].path}').then((m) => {
      const component = m.default || m
      breadcrumbsLoad(component, ctx)
      return component
    })`
  } else {
    return `import('${config.pages[component].path}').then((m) => {
      let component = m.${config.pages[component].component}
      component = component.default || component
      breadcrumbsLoad(component, ctx)
      return component
    })`
  }
}
export default (config: VueFrontConfig) => {
  let whiteList = []
  let exclude = []
  let routes = []
  for (const url in config.seo) {
    const pageComponent = config.seo[url]
    if (!_.isUndefined(pageComponent.generate) && pageComponent.generate) {
      whiteList = [...whiteList, url]
    } else if (_.isUndefined(pageComponent.generate) && !url.includes(':')) {
      whiteList = [...whiteList, url]
    } else {
      exclude = [...exclude, url]
    }
    let result = []
      routes.push({
        name: url.replace('/', '_').replace(':', '_'),
        path: url,
        component: convertComponent(pageComponent.component, config)
      })
    if (!_.isUndefined(pageComponent.seo) && !_.isEmpty(result)) {
      for (const urlKey in result) {
        if (result[urlKey].url !== '') {
          if (
            !_.isUndefined(pageComponent.generate) &&
            pageComponent.generate
          ) {
            whiteList = [
              ...whiteList,
              result[urlKey].url,
            ]
          } else if (_.isUndefined(pageComponent.generate)) {
            whiteList = [
              ...whiteList,
              result[urlKey].url,
            ]
          } else {
            exclude = [...exclude, result[urlKey].url]
          }
        }
      }
    }
  }

  return {
    routes,
    whiteList,
    exclude
  }
}
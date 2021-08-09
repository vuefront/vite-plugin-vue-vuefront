import * as _ from 'lodash'
const convertComponent = (component: string, config: VueFrontConfig): string => {
  if (!config.pages) {
    return ''
  }
  if ((config.pages[component] as VueFrontComponent).type === 'full') {
    return `import('${(config.pages[component] as VueFrontComponent).path}').then((m) => {
      const component = m.default || m
      breadcrumbsLoad(component, ctx)
      return component
    })`
  } else {
    return `import('${(config.pages[component] as VueFrontComponent).path}').then((m) => {
      let component = m.${(config.pages[component] as VueFrontComponent).component}
      component = component.default || component
      breadcrumbsLoad(component, ctx)
      return component
    })`
  }
}
export default (config: VueFrontConfig) => {
  let whiteList: string[] = []
  let exclude: string[] = []
  let routes: {name: string; path: string; component: string }[] = []
  for (const url in config.seo) {
    const pageComponent = config.seo[url]
    if (!_.isUndefined(pageComponent.generate) && pageComponent.generate) {
      whiteList = [...whiteList, url]
    } else if (_.isUndefined(pageComponent.generate) && !url.includes(':')) {
      whiteList = [...whiteList, url]
    } else {
      exclude = [...exclude, url]
    }
    routes.push({
      name: url.replace('/', '_').replace(':', '_'),
      path: url,
      component: convertComponent(pageComponent.component, config)
    })
  }

  return {
    routes,
    whiteList,
    exclude
  }
}
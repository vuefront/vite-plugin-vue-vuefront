import * as _ from 'lodash'
const convertComponent = (component: string, config: VueFrontConfig): string => {
  if (!config.pages) {
    return ''
  }
  if ((config.pages[component] as VueFrontComponent).type === 'full') {
    return `import('${(config.pages[component] as VueFrontComponent).path}')`
  } else {
    return `import('${(config.pages[component] as VueFrontComponent).path}').then((m) => {
      let component = m.${(config.pages[component] as VueFrontComponent).component}
      component = component.default || component
      return component
    })`
  }
}
const convertLoader = (component: string, config: VueFrontConfig): string => {
  if (!config.loaders) {
    return ''
  }
  if ((config.loaders[component] as VueFrontComponent).type === 'full') {
    return `() => import('${(config.loaders[component] as VueFrontComponent).path}')`
  } else {
    return `() => import('${(config.loaders[component] as VueFrontComponent).path}').then((m) => {
      let component = m.${(config.loaders[component] as VueFrontComponent).component}
      component = component.default || component
      return component
    })`
  }
}
export default (config: VueFrontConfig) => {
  let whiteList: string[] = []
  let exclude: string[] = []
  let routes: {name: string; path: string; component: string; props: {[x: string]: any} | null }[] = []
  for (const url in config.seo) {
    const pageComponent = config.seo[url]
    if (!_.isUndefined(pageComponent.generate) && pageComponent.generate) {
      whiteList = [...whiteList, url]
    } else if (_.isUndefined(pageComponent.generate) && !url.includes(':')) {
      whiteList = [...whiteList, url]
    } else {
      exclude = [...exclude, url]
    }
    const props: {loader?: string} = {}

    if (pageComponent.loader) {
      props.loader = convertLoader(pageComponent.loader, config)
    }
    routes.push({
      name: url.replace('/', '_').replace(':', '_'),
      path: url,
      props,
      component: convertComponent(pageComponent.component, config)
    })
  }

  return {
    routes,
    whiteList,
    exclude
  }
}
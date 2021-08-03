import {getMatchedComponents, applyAsyncData, getMatchedComponentsInstances, compile} from "@vuefront-utils";
let _lastPaths = []
export async function dataFetch (app, to, from, next) {
  if (this._routeChanged === false && this._paramChanged === false && this._queryChanged === false) {
    return next()
  }

  let spaFallback = false
  if (to === from) {
    _lastPaths = []
    spaFallback = true
  } else {
    const fromMatches = []
    _lastPaths = getMatchedComponents(from, fromMatches).map((Component, i) => {
      return compile(from.matched[fromMatches[i]].path)(from.params)
    })
  }

  let matches = []
  const Components = getMatchedComponents(to, matches)

  let instances

  await Promise.all(Components.map(async (Component, i) => {
    Component._path = compile(to.matched[matches[i]].path)(to.params)
      Component._dataRefresh = false
      const childPathChanged = Component._path !== _lastPaths[i]
      // Refresh component (call asyncData & fetch) when:
      // Route path changed part includes current component
      // Or route param changed part includes current component and watchParam is not `false`
      // Or route query is changed and watchQuery returns `true`
      if (this._routeChanged && childPathChanged) {
        Component._dataRefresh = true
      } else if (this._paramChanged && childPathChanged) {
        const watchParam = Component.options.watchParam
        Component._dataRefresh = watchParam !== false
      } else if (this._queryChanged) {
        const watchQuery = Component.options.watchQuery
        if (watchQuery === true) {
          Component._dataRefresh = true
        } else if (Array.isArray(watchQuery)) {
          Component._dataRefresh = watchQuery.some(key => this._diffQuery[key])
        } else if (typeof watchQuery === 'function') {
          if (!instances) {
            instances = getMatchedComponentsInstances(to)
          }
          Component._dataRefresh = watchQuery.apply(instances[i], [to.query, from.query])
        }
      }

      if (typeof Component.options === 'undefined') {
        return
      }

    const hasAsyncData = (
      Component.options.asyncData &&
      typeof Component.options.asyncData === 'function'
    )

    const hasFetch = Boolean(Component.options.fetch) && Component.options.fetch.length

    if (hasAsyncData) {
      const asyncDataResult = await Component.options.asyncData(app)

      applyAsyncData(Component, asyncDataResult)
    }

    if (hasFetch) {
      await Component.options.fetch(app)
    }
  }))
  next()
}
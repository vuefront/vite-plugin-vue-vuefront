import {nextTick} from 'vue'
import {getMatchedComponentsInstances, getMatchedComponents} from '@vuefront-utils'
export function fixPrepatch (to, ___) {
  if (this._routeChanged === false && this._paramChanged === false && this._queryChanged === false) {
    return
  }

  const instances = getMatchedComponentsInstances(to)
  const Components = getMatchedComponents(to)

  let triggerScroll = false

  nextTick(() => {
    instances.forEach((instance, i) => {
      if (!instance || instance._isDestroyed) {
        return
      }

      if (
        instance.constructor && 
        instance.constructor._dataRefresh &&
        Components[i] === instance.constructor &&
        instance.$vnode.data.keepAlive !== true &&
        typeof instance.constructor.options.data === 'function'
      ) {
        const newData = instance.constructor.options.data.call(instance)
        for (const key in newData) {
          Vue.set(instance.$data, key, newData[key])
        }

        triggerScroll = true
      }
    })

    // checkForErrors(this)

    // // Hot reloading
    // setTimeout(() => hotReloadAPI(this), 100)
  })
}
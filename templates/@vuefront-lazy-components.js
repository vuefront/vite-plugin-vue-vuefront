import {resolveRouteComponents} from '@vuefront-utils'
import {getQueryDiff} from '@vuefront-utils'
export async function loadAsyncComponents (to, from, next) {
  let fromVal = from
  if (from.value) {
    fromVal = from.value
  }
  let toVal = to
  if (to.value) {
    toVal = to.value
  }
  this._routeChanged = fromVal.name !== toVal.name
  this._paramChanged = !this._routeChanged && fromVal.path !== toVal.path
  this._queryChanged = !this._paramChanged && fromVal.fullPath !== toVal.fullPath
  this._diffQuery = (this._queryChanged ? getQueryDiff(toVal.query, fromVal.query) : [])
  try {
    await resolveRouteComponents(
        to,
        (Component, instance) => ({ Component, instance })
      )
    next()
  } catch (error) {
    console.log(error)
    next()
  }
}
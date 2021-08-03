import {resolveRouteComponents} from '@vuefront-utils'
import {getQueryDiff} from '@vuefront-utils'
export async function loadAsyncComponents (to, from, next) {
  this._routeChanged = from.name !== to.name
  this._paramChanged = !this._routeChanged && from.path !== to.path
  this._queryChanged = !this._paramChanged && from.fullPath !== to.fullPath
  this._diffQuery = (this._queryChanged ? getQueryDiff(to.query, from.query) : [])
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
import {resolveRouteComponents} from '@vuefront-utils'

export async function loadAsyncComponents (to, from, next) {
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
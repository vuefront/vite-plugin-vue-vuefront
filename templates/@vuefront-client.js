import {loadAsyncComponents} from '@vuefront-lazy-components'
import {seoResolver} from '@vuefront-seo-resolver'
import {dataFetch} from '@vuefront-data-fetch'
import {normalizeComponents} from '@vuefront-utils'
import {fixPrepatch} from '@vuefront-fix-prepatch'

export default async (app) => {
  app.$router.afterEach(normalizeComponents.bind(app))
  app.$router.afterEach(fixPrepatch.bind(app))

  app.$router.beforeEach((to, from, next) => {
    console.log('seoResolver')
    seoResolver.call(app, app, to, from, next)
  })
  app.$router.beforeEach(loadAsyncComponents.bind(app))
  app.$router.beforeEach((to, from, next) => {
    console.log('dataFetch')
    dataFetch.call(app, app, to, from, next)
  })

  await loadAsyncComponents.call(app, app.$router.currentRoute, app.$router.currentRoute, (path)=>{
    if (path) {
      app.$router.push(path)
    }
  })
  await seoResolver.call(app, app, app.$router.currentRoute, app.$router.currentRoute, (path) => {
    if (path) {
      app.$router.push(path)
    }
  })
  await dataFetch.call(app, app, app.$router.currentRoute, app.$router.currentRoute, (path) => {
    if (path) {
      app.$router.push(path)
    }
  })
}
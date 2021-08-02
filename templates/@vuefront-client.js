import {loadAsyncComponents} from '@vuefront-lazy-components'
import {seoResolver} from '@vuefront-seo-resolver'
import {dataFetch} from '@vuefront-data-fetch'

export default (app) => {
  app.$router.beforeEach((to, from, next) => {
    seoResolver(app, to, from, next)
  })
  app.$router.beforeEach(loadAsyncComponents)
  app.$router.beforeEach((to, from, next) => {
    dataFetch(app, to, from, next)
  })
}
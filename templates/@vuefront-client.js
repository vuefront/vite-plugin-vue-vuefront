import {seoResolver} from '@vuefront-seo-resolver'

export default async (app) => {
  app.$router.beforeEach((to, from, next) => {
    seoResolver.call(app, app, to, from, next)
  })
  await seoResolver.call(app, app, app.$router.currentRoute, app.$router.currentRoute, (path) => {
    if (path) {
      app.$router.push(path)
    }
  })
}
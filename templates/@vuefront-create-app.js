import {createApp} from 'vue'
import {createStore} from 'vuex'
import {createRouter, createWebHistory, createMemoryHistory} from 'vue-router'
import routes from 'voie-pages';
import Cookie from '@vuefront-cookie'
import {isUndefined} from 'lodash'

import {getRoutes} from '@vuefront-routes'
import VuefrontI18n from '@vuefront-i18n'
import VuefrontPlugin from "@vuefront-plugin";
import VuefrontClient from '@vuefront-client'

export const createVueFrontApp = async (App) => {
  process.client = true
  const app = {
    ...App
  }
  let context = {...app}
  let vuefrontApp = null

  let injectVars = {}

  let store = null

  const inject = (key, value) => {
    if (isUndefined(app[key])) {
      key = '$' + key
      context[key] = value
      app[key] = value
      store[key] = value
      injectVars[key] = value
      context.app.config.globalProperties[key] = value
      context.app.provide(key, value)
    }
  }
  context.router = null

  let i18n = null
  let router = null
  
  vuefrontApp = createApp({
    i18n,
    store,
    router,
    ...app,
    ...injectVars,
  })
  context.app = vuefrontApp
  router = createRouter({
    history: import.meta.env.SSR ? createMemoryHistory() : createWebHistory(),
    routes: [...routes, ...getRoutes(context),
      {
        name: '_slug',
        path: '/:slug',
        component: { template: '<vf-t-common-error></vf-t-common-error>' }
      }
    ],
    fallback: false
  })
  
  context.$router = router
  context.app.use(router)
  context = {...context,  get $route() {
    return router.currentRoute
  }}

  store = createStore()
  store.app = context.app
  context.app.use(store)
  store.$router = router

  context.$store = store
  context.store = store
  const cookies = Cookie()
  inject('cookies', cookies)

  await VuefrontPlugin(context, inject)
  i18n = await VuefrontI18n(context, inject)
  inject('i18n', i18n)
  // store.app =  injectVars
  store.app.i18n = i18n

  if(typeof document === "undefined") {
    await store.dispatch('vuefront/nuxtServerInit', app)
  } else if(typeof document !== "undefined") {
    await store.dispatch('vuefront/nuxtClientInit', app)
  }
  await VuefrontClient(context)
  
  if (typeof window !== 'undefined') {
    window.__VUEFRONT__ = context
  }
  return {app: vuefrontApp, router}
}
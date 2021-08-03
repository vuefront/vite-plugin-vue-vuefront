import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import routes from 'voie-pages';
import Cookie from 'cookie-universal'
import isUndefined from 'lodash/isUndefined'

import {getRoutes} from '@vuefront-routes'
import VuefrontI18n from '@vuefront-i18n'
import VuefrontPlugin from "@vuefront-plugin";
import VuefrontClient from '@vuefront-client'


Vue.use(VueRouter)
Vue.use(Vuex)

export const createVueFrontApp = async (App) => {
  process.client = true
  const app = {
    ...App
  }
  let context = {...app}
  let vuefrontApp = null

  let injectVars = {}
  const store = new Vuex.Store()

  context.$store = store
  context.store = store

  const inject = (key, value) => {
    if (isUndefined(app[key])) {
      key = '$' + key
      context[key] = value
      app[key] = value
      store[key] = value
      injectVars[key] = value
      Vue.use(() => {
        if (!Vue.prototype.hasOwnProperty(key)) {
          Object.defineProperty(Vue.prototype, key, {
            get() {
              return this.$root.$options[key]
            }
          })
        }
      })
    }
  }
  context.router = null

  const router = new VueRouter({
    mode: "history",
    routes: [...routes, ...getRoutes(context),
    ],
    fallback: false
  })
  context.$router = router
  context = {...context,  get $route() {
    return router.currentRoute
  }}
  store.$router = router


  const cookies = Cookie()
  inject('cookies', cookies)


  await VuefrontPlugin(context, inject)
  const i18n = await VuefrontI18n(context, inject)
  inject(i18n, inject)
  store.app = injectVars
  store.app.i18n = i18n
  
  vuefrontApp = new Vue({
    i18n,
    store,
    router,
    ...app,
    ...injectVars,
  })
  if(!document) {
    await store.dispatch('vuefront/nuxtServerInit', app)
  } else if(document) {
    await store.dispatch('vuefront/nuxtClientInit', app)
  }
  await VuefrontClient(context)
  
  window.__VEUFRONT__ = context
  return vuefrontApp
}
import VuefrontPlugin from "@vuefront-plugin";
import { createRouter, createWebHistory } from 'vue-router'
import { createStore } from "vuex";
import routes from 'voie-pages';
import gql from 'graphql-tag'
import {getRoutes} from '@vuefront-routes'
import { createApp } from 'vue'
import {createI18n} from 'vue-i18n/index'
import isUndefined from 'lodash/isUndefined'
import merge from 'lodash-es/merge'
import VueLazyLoad from 'vue3-lazyload'

import Cookie from 'cookie-universal'
<% for (var key in options.themeOptions.extensions) { %>
  <% if (options.themeOptions.extensions[key].type === 'full') { %>
     import <%= key %> from '<%= options.themeOptions.extensions[key].path %>'
  <% } else { %>
    import {<%= options.themeOptions.extensions[key].component %> as <%= key %>} from '<%= options.themeOptions.extensions[key].path %>'
<% } %><% } %>
<% for (var key in options.themeOptions.templates) { %>
  <% if (key.startsWith('Layout')) {%>
    <% if (options.themeOptions.templates[key].type === 'full') { %>
      import <%= key %> from '<%= options.themeOptions.templates[key].path %>'
    <% } else { %>
      import {<%= options.themeOptions.templates[key].component %> as <%= key %>} from '<%= options.themeOptions.templates[key].path %>'
    <% } %>
  <% } %>
<% } %>

function getComponent (to, app) {
  const toRoute = app.$router.resolve(to).matched
  return toRoute[0].components.default
}

async function loadLocaleMessages(options) {
  const messages = {}
  let result = {}

  <% for (var key in options.themeOptions.locales) { %>
    if(isUndefined(messages['<%= key %>'])) {
      messages['<%= key %>'] = {}
    }
    <% for (var key2 in options.themeOptions.locales[key]) { %>
      <% if (options.themeOptions.locales[key][key2].type === 'full') { %>
        result = await import('<%= options.themeOptions.locales[key][key2].path %>')
    messages['<%= key %>'] = merge({}, messages['<%= key %>'], result)
    <% } else { %>
      result = await import('<%= options.themeOptions.locales[key][key2].path %>')

    messages['<%= key %>'] = merge({}, messages['<%= key %>'], result['<%= options.themeOptions.locales[key][key2].component %>'])
      <% } %>
    <% } %>
      
  <% } %>

  return messages
}


export const createVueFrontApp = async (App) => {
  const app = {
    ...App
  }
  let vuefrontApp = null

  let injectVars = {}
  const store = createStore()

  const inject = (key, value) => {
    if (isUndefined(app[key])) {
      key = '$' + key
      app[key] = value
      store[key] = value
      injectVars[key] = value
    }
  }

  const router = createRouter({
    history: createWebHistory(),
    routes: [...routes, ...getRoutes(), 
      // { 
      //   path: '/:pathMatch(.*)*', 
      //   redirect: '/404' 
      // }
    ],
  })
  const cookies = Cookie()
  inject('cookies', cookies)
  inject('router', router)
  inject('route', router.currentRoute)
  inject('store', store)
  store.app = injectVars

  await VuefrontPlugin(app, inject)
  const messages = await loadLocaleMessages()
  vuefrontApp = createApp({
    ...app,
    ...injectVars,
  }).use(router).use(store)
  if(!document) {
    await store.dispatch('vuefront/nuxtServerInit', app)
  } else if(document) {
    await store.dispatch('vuefront/nuxtClientInit', app)
  }
  const i18n = createI18n({
    locale: store.getters['common/language/locale'],
    messages
  })
  <% for (var key in options.themeOptions.templates) { %>
    <% if (key.startsWith('Layout')) {%>
      vuefrontApp.component('VfT<%= key %>', <%= key %>);
    <% } %>
  <% } %>
  <% for (var key in options.themeOptions.extensions) { %>
      vuefrontApp.component('VfE<%= key %>', <%= key %>);
  <% } %>
  vuefrontApp.use(i18n)
  vuefrontApp.use(VueLazyLoad, {
    throttleWait: 10000
  })
  vuefrontApp.config.globalProperties.$vfapollo = injectVars.$vfapollo
  vuefrontApp.config.globalProperties.$vuefront = injectVars.$vuefront
  app.$router.beforeEach(async (to, from, next) => {

    
    const matched = app.$router.resolve(to).matched
    if (matched.length === 0) {
      try {
        const { data } = await app.$vfapollo.query({
          query: gql`query($url: String) {
            searchUrl(url: $url) {
              url
              type
              id
            }
          }`,
          variables: {
            url: to.path
          }
        })
        const { type, id } = data.searchUrl
        if (type && id) {
          console.log(type, id)
          if (type === 'page') {
            const categoryRoute = app.$router.resolve('/store/category/' + id).matched

            app.$router.addRoute({
              name: to.path,
              component: getComponent('/page/' + id, app),
              alias: to.path,
              path: '/page/' + id,
              props: {
                id
              },
            })
          } else if (type === 'category') {
            app.$router.addRoute({
              name: to.path,
              component: getComponent('/store/category/' + id, app),
              alias: to.path,
              path: '/store/category/' + id,
              props: {
                id
              },
            })
          } else if (type === 'manufacturer') {
             app.$router.addRoute({
              component: getComponent('/store/manufacturer/' + id, app),
              name: to.path,
              alias: to.path,
              path: '/store/manufacturer/' + id,
              props: {
                id
              },
            })
          } else if (type === 'product') {
             app.$router.addRoute({
              name: to.path,
              alias: to.path,
              component: getComponent('/store/product/' + id, app),
              props: {
                id
              },
              path: '/store/product/' + id
            })
          } else if (type === 'store') {
             app.$router.addRoute({
              name: to.path,
              alias: to.path,
              component: getComponent('/mystore/' + id, app),
              path: '/mystore/' + id,
              props: {
                id
              },
            })
          } else if (type === 'blog-category') {
             app.$router.addRoute({
              name: to.path,
              alias: to.path,
              component: getComponent('/blog/category/' + id, app),
              path: '/blog/category/' + id,
              props: {
                id
              },
            })
          } else if (type === 'blog-post') {
             app.$router.addRoute({
              name: to.path,
              alias: to.path,
              component: getComponent('/blog/post/' + id, app),
              path: '/blog/post/' + id,
              props: {
                id
              },
            })
          } else {
            next()
          }
          next({ ...to, replace: true })
        } else {
          next()
        }
      } catch (e) {
        console.log(e);
        app.$store.commit('vuefront/setResponseError', e)
        next()
      }
    } else {
      next()
    }
  })
  window.$router = app.$router
  return vuefrontApp
}
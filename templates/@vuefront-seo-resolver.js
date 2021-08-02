import gql from 'graphql-tag'

export async function seoResolver (app, to, from, next) {
  const matched = app.$router.getMatchedComponents(to)
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
        if (type === 'page') {
          app.$router.addRoute({
            name: to.path,
            alias: to.path,
            path: '/page/' + id,
          })
        } else if (type === 'category') {
          app.$router.addRoute({
            name: to.path,
            alias: to.path,
            path: '/store/category/' + id,
          })
        } else if (type === 'manufacturer') {
          app.$router.addRoute({
            name: to.path,
            alias: to.path,
            path: '/store/manufacturer/' + id,
          })
        } else if (type === 'product') {
          app.$router.addRoute({
            name: to.path,
            alias: to.path,
            path: '/store/product/' + id
          })
        } else if (type === 'store') {
          app.$router.addRoute({
            name: to.path,
            alias: to.path,
            path: '/mystore/' + id,
          })
        } else if (type === 'blog-category') {
          app.$router.addRoute({
            name: to.path,
            alias: to.path,
            path: '/blog/category/' + id,
          })
        } else if (type === 'blog-post') {
          app.$router.addRoute({
            name: to.path,
            alias: to.path,
            path: '/blog/post/' + id,
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
}
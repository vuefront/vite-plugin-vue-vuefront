import gql from 'graphql-tag'

export async function seoResolver (app, to, from, next) {
  console.log('seo resolver')
  let toVal = to
  if(to.value) {
    toVal = to.value
  }
  const matched = app.$router.resolve(toVal.path).matched
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
          url: toVal.path
        }
      })
      const { type, id } = data.searchUrl
      const name = toVal.path.replace(/\//g, '__')
      if (type && id) {
        if (type === 'page') {
          app.$router.addRoute({
            name,
            path: toVal.path,
            redirect: '/page/' + id,
          })
        } else if (type === 'category') {
          app.$router.addRoute({
            name,
            path: toVal.path,
            redirect: '/store/category/' + id,
          })
        } else if (type === 'manufacturer') {
          app.$router.addRoute({
            name,
            path: toVal.path,
            redirect: '/store/manufacturer/' + id,
          })
        } else if (type === 'product') {
          app.$router.addRoute({
            name,
            path: toVal.path,
            redirect: '/store/product/' + id
          })
        } else if (type === 'store') {
          app.$router.addRoute({
            name,
            path: toVal.path,
            redirect: '/mystore/' + id,
          })
        } else if (type === 'blog-category') {
          app.$router.addRoute({
            name,
            path: toVal.path,
            redirect: '/blog/category/' + id,
          })
        } else if (type === 'blog-post') {
          app.$router.addRoute({
            name,
            path: toVal.path,
            redirect: '/blog/post/' + id,
          })
        } else {
          next()
        }
        next({ path: toVal.path })
        // next({ ...to, replace: true })
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
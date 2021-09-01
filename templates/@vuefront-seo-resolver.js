import gql from 'graphql-tag'

export async function seoResolver (app, to, from, next) {
  let toVal = to
  if(to.value) {
    toVal = to.value
  }
  const matched = app.$router.resolve(toVal.path).matched

  if (matched.length > 0 && matched[0].name === '_slug') {
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
        if (type && id) {
          if (type === 'page') {
            next(`/page/` + id)
          } else if (type === 'category') {
            next(`/store/category/` + id)
          } else if (type === 'manufacturer') {
            next(`/store/manufacturer/` + id)
          } else if (type === 'product') {
            next(`/store/product/` + id)
          } else if (type === 'store') {
            next(`/mystore/` + id)
          } else if (type === 'blog-category') {
            next(`/blog/category/` + id)
          } else if (type === 'blog-post') {
            next(`/blog/post/` + id)
          } else {
            next()
          }
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
import isUndefined from 'lodash-es/isUndefined'
const applyAsyncData = (Component, asyncData) => {
  if (
    !asyncData
  ) {
    return
  }
  const ComponentData = Component.data || function () { return {} }
  Component._originDataFn = ComponentData

  Component.data = function () {
    const data = ComponentData.call(this, this)
    return { ...data, ...asyncData }
  }

  if (Component._Ctor && Component._Ctor.options) {
    Component._Ctor.data = Component.data
  }
}
const breadcrumbsLoad = (component, context) => {
    component.serverPrefetch = function() {
      return new Promise(async (resolve) => {
        this.$store.dispatch('common/breadcrumbs/init');
        if(this.handleLoadData) {
          await this.handleLoadData(this)
        }
        await this.$store.dispatch('common/breadcrumbs/load');
        resolve()
      })
    }
    // component.beforeRouteEnter = async (to, from, next) => {
    //   if (!isUndefined(component.fetch)) {
    //       await component.fetch({
    //       route: to,
    //       router: context.$router,
    //       store: context.$store,
    //       ...context,
    //     })
    //   }
    //   if (component.asyncData) {
    //     const asyncDataResult = await component.asyncData(context)
    //     applyAsyncData(component, asyncDataResult)
    //   }
    //   next()
    // }
    component.created = function() {
        if (typeof this.loaded !== 'undefined') {
        if(!this.loaded) {
          this.$store.dispatch('common/breadcrumbs/init');

          this.$watch('loaded', () => {
              this.$store.dispatch('common/breadcrumbs/load');
          })
        }
      } else {
          this.$store.dispatch('common/breadcrumbs/load');
      }
    }
  }
  
  export const getRoutes = (ctx) => {
      return [<% for (var i=0; i < options.routes.length; i++){%> {
          name: '<%= options.routes[i].name %>',
          path: '<%= options.routes[i].path %>',
          <% if(typeof options.routes[i].props !== 'undefined') {%>
          props: <%= JSON.stringify(options.routes[i].props) %>,
          <% } %>
          component: () => {
            return <%= options.routes[i].component %>
          }
  
      }, <% } %>]
  }
  
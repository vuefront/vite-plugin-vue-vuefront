import {defineAsyncComponent} from 'vue'
export const getRoutes = (ctx) => {
      return [<% for (var i=0; i < options.routes.length; i++){%> {
          name: '<%= options.routes[i].name %>',
          path: '<%= options.routes[i].path %>',
          <% if(typeof options.routes[i].props !== 'undefined') {%>
            meta: {
            <% if(typeof options.routes[i].props.loader !== 'undefined') {%>
            loader: defineAsyncComponent(<%= options.routes[i].props.loader %>)
            <% } %>
            },
          <% } %>
          component: () => <%= options.routes[i].component %>
  
      }, <% } %>]
  }
  
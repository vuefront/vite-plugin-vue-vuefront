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
  
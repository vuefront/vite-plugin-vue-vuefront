import {set} from 'lodash'
import {createStore} from 'vuex'<% for (var key in options.themeOptions.store) { %><% if (typeof options.themeOptions.store[key].module !== 'undefined') {%><% if (options.themeOptions.store[key].module.type === 'full') { %>
import * as <%= key %> from '<%= options.themeOptions.store[key].module.path %>'<% } else { %>
import {<%= options.themeOptions.store[key].module.component %> as <%= key %>} from <%= options.themeOptions.store[key].module.path %><% } %><% } %><% } %>
export default (ctx, inject) => {
  let modules = {}
  <% for (var key in options.themeOptions.store) { %><% if (typeof options.themeOptions.store[key].module !== 'undefined') {%>
  modules = set(modules, <%= JSON.stringify(options.themeOptions.store[key].path) %>, { namespaced: true, ...<%= key %>})<% } else { %>
    modules = set(modules, <%= JSON.stringify(options.themeOptions.store[key].path) %>, { namespaced: true})<% } %><% } %>
  return createStore({modules})
}
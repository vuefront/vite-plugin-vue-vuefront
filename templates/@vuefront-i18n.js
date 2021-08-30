import {createI18n} from 'vue-i18n'
import merge from 'lodash-es/merge'
import isUndefined from 'lodash-es/isUndefined'


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


export default async (ctx, inject) => {
  const messages = await loadLocaleMessages()

  const i18n =  createI18n({
    locale: ctx.$store.getters['common/language/locale'],
    messages
  })
  ctx.app.use(i18n)

  return i18n
}
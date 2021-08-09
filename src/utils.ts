import * as qs from 'querystring'

export interface VueQuery {
  vue?: boolean
  src?: boolean
  type?: 'script' | 'template' | 'style' | 'custom'
  index?: number
  lang?: string
  raw?: boolean
}

export function parseVueRequest(id: string): {
  filename: string
  query: VueQuery
} {
  const [filename, rawQuery] = id.split(`?`, 2)

  const query = qs.parse(rawQuery) as VueQuery
  if (query.vue != null) {
    query.vue = true
  }
  if (query.src != null) {
    query.src = true
  }
  if (query.index != null) {
    query.index = Number(query.index)
  }
  if (query.raw != null) {
    query.raw = true
  }
  return {
    filename,
    query
  }
}

/**
 * Stolen from Vue
 * @see https://github.com/vuejs/vue/blob/52719cca/src/shared/util.js
 */

 const camelizeRE = /-(\w)/g
 export const camelize = (str: string) => {
   return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : '')
 }
 
 export const capitalize = (str: string) => {
   return str.charAt(0).toUpperCase() + str.slice(1)
 }
 
 const hyphenateRE = /\B([A-Z])/g
 export const hyphenate = (str: string) => {
   return str.replace(hyphenateRE, '-$1').toLowerCase()
 }
 
 export function requirePeer (name: string) {
   try {
     return require(name)
   } catch (e) {
     if (e.code !== 'MODULE_NOT_FOUND') throw e
     throw new Error(`Module "${name}" required by "vuefront-loader" not found.`)
   }
 }

 
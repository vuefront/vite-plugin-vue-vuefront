import {getMatchedComponents, applyAsyncData} from "@vuefront-utils";

export async function dataFetch (app, to, from, next) {
  let matches = []
  const Components = getMatchedComponents(to, matches)
  await Promise.all(Components.map(async (Component, i) => {
    const hasAsyncData = (
      Component.options.asyncData &&
      typeof Component.options.asyncData === 'function'
    )

    const hasFetch = Boolean(Component.options.fetch) && Component.options.fetch.length

    if (hasAsyncData) {
      const asyncDataResult = await Component.options.asyncData(app)

      applyAsyncData(Component, asyncDataResult)
    }

    if (hasFetch) {
      await Component.options.fetch(app)
    }
  }))
  next()
}
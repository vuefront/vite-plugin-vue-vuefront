import * as _ from 'lodash'
export default (config: VueFrontConfig) => {
  let result = {}

  for (const key in config.image) {
    const image = config.image[key]
    result[key] = {}
    if(_.isString(image)) {
      result[key].image = `await import('${image}')`
    } else if (_.isObject(image)) {
      if(image.path) {
        result[key].image = `await import('${image.path}')`
      }
      if(image.width && image.height) {
        result[key].width = image.width
        result[key].height = image.height
      }
    }
  }

  return result
}
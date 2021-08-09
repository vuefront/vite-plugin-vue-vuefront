import * as _ from 'lodash'
export default (config: VueFrontConfig) => {
  let result: VueFrontImageList = {}

  for (const key in config.image) {
    const image = config.image[key]
    result[key] = {
      image: '',
      width: '',
      height: '',
      path: ''
    }
    if(_.isString(image)) {
      result[key].image = `await import('${image}?url')`
    } else if (_.isObject(image)) {
      if(image.path) {
        result[key].image = `await import('${image.path}?url')`
      }
      if(image.width && image.height) {
        result[key].width = image.width
        result[key].height = image.height
      }
    }
  }

  return result
}
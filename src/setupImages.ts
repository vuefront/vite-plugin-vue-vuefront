import * as _ from 'lodash'

export default (config: VueFrontConfig) => {
  let result: VueFrontImageList = {}
  let images: VueFrontImageList = {}
  if (config.images) {
    images = _.merge(images, config.images)
  }
  if (config.image) {
    images = _.merge(images, config.image)
  }

  for (const key in images) {
    const image = images[key]
    result[key] = {
      image: '',
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
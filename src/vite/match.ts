import * as  _ from 'lodash'
import { camelize, capitalize, hyphenate } from '../utils'
const renderImport = (component, tag) => {
  let result = ''

  if (component.type === 'full') {
    result = `() =>  import('${component.path}')`
  } else {
    result = `() => import('${component.path}').then(m => (m.${component.component}))`
  }

  return result
}
const renderImportCss = (component, tag) => {
  let result = ''

  if (component.css) {
    result += `import "${component.css}"`
  }

  return result
}
const getImport = (name, type, config, tag, renderImport) => {
  let comImport = false

  switch (type) {
    case 'A':
    if(!config.atoms[name]) {
      return
    }
    comImport = renderImport(config.atoms[name], tag)
    break;
    case 'M':
    if(!config.molecules[name]) {
      return
    }
    comImport = renderImport(config.molecules[name], tag)
    break;
    case 'O':
    if(!config.organisms[name]) {
      return
    }
    comImport = renderImport(config.organisms[name], tag)
    break;
    case 'T':
    if(!config.templates[name]) {
      return
    }
    comImport = renderImport(config.templates[name], tag)
    break;
    case 'L':
    if(!config.loaders[name]) {
      return
    }
    comImport = renderImport(config.loaders[name], tag)
    break;
    case 'E':
    if(!config.extensions[name]) {
      return
    }
    comImport = renderImport(config.extensions[name], tag)
    break;
  }
  return comImport
}
const normalize = items =>
  items.map(item => ({
    kebab: hyphenate(item),
    camel: capitalize(camelize(item)),
  }));

const getComponents = (config: VueFrontConfig, tags) => {
  return normalize(tags)
    .filter(
      ({ kebab, camel }) => 
        kebab.startsWith('vf-'),
    )
    .map(({ camel }) => camel);
};

module.exports = {
  getComponents,
};

export function camelCase(str: string) {
  return str.replace(/-(\w)/g, (_, c) => (c ? c.toUpperCase() : ''))
}

export function kebabCase(key: string) {
  const result = key.replace(/([A-Z])/g, ' $1').trim()
  return result.split(' ').join('-').toLowerCase()
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function pascalCase(str: string) {
  return capitalize(camelCase(str))
}

const renderImport = (component: VueFrontComponent, tag: string) => {
  let result = ''

  if (!component) {
    return ''
  }

  if (component.type === 'full') {
    result = `import ${tag} from '${component.path}';`
  } else {
    result = `import {${component.component}} from '${component.path}';`
  }

  return result
}
const renderImportCss = (component: VueFrontComponent, tag: string) => {
  let result = ''

  if (component.css) {
    result += `import "${component.css}"`
  }

  return result
}
type IRenderFunction = (component: VueFrontComponent, tag: string) => string;
const getImport = (name: string, type: string, config: VueFrontConfig, tag: string, renderImport: IRenderFunction): boolean | string | void => {
  let comImport: boolean | string | void = false

  switch (type) {
    case 'A':
    if(!config.atoms || !config.atoms[name]) {
      return
    }
    
    comImport = renderImport(config.atoms[name] as VueFrontComponent, tag)

    break;
    case 'M':
    if(!config.molecules || !config.molecules[name]) {
      return
    }
    comImport = renderImport(config.molecules[name] as VueFrontComponent, tag)
    break;
    case 'O':
    if(!config.organisms || !config.organisms[name]) {
      return
    }
    comImport = renderImport(config.organisms[name] as VueFrontComponent, tag)
    break;
    case 'T':
    if(!config.templates || !config.templates[name]) {
      return
    }
    comImport = renderImport(config.templates[name] as VueFrontComponent, tag)
    break;
    case 'L':
    if(!config.loaders || !config.loaders[name]) {
      return
    }
    comImport = renderImport(config.loaders[name] as VueFrontComponent, tag)
    break;
    case 'E':
    if(!config.extensions || !config.extensions[name]) {
      return
    }
    comImport = renderImport(config.extensions[name] as VueFrontComponent, tag)
    break;
  }
  return comImport
}

export default (code: string, components = [], config: VueFrontConfig) => {
  const imports = []
  for (const tag of components) {
    const regex = /^Vf(.)(.*)$/gm

    const m = regex.exec(tag)

    if (!m) {
      continue
    }

    const type = m[1]
    const name = m[2]
    let comImport = getImport(name, type, config, tag, renderImport)
    let comImportCss = getImport(name, type, config, tag, renderImportCss)
    imports.push([tag, comImport, comImportCss])
  }
  if (imports.length) {
    let newContent = '/* vuefront-loader */\n'
    newContent += `import installComponents from "vite-plugin-vue-vuefront/installComponents"\n`
    newContent += imports.map(i => i[2]).join('\n') + '\n'
    let result = []
    for (const item of imports) {
      newContent += item[1];
      result.push(`${item[0]}`)
    }
    newContent += `\n\nif (typeof component !== "undefined") {\n installComponents(component, {${result.join(',')}})\n}\n`
    // Insert our modification before the HMR code
    const hotReload = code.indexOf('/* hot reload */')
    if (hotReload > -1) {
      code = code.slice(0, hotReload) + newContent + '\n\n' + code.slice(hotReload)
    } else {
      code += '\n\n' + newContent
    }
  }

  return code;
};

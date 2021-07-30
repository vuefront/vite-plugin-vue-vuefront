const renderImport = (component, tag) => {
  let result = ''

  if (component.type === 'full') {
    result = `import ${tag} from '${component.path}';`
  } else {
    result = `import {${component.component}} from '${component.path}';`
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

export default (code, components = [], config: VueFrontConfig) => {
  const imports = []
  for (const tag of components) {
    const regex = /^Vf(.)(.*)$/gm

    const m = regex.exec(tag)
  
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
    newContent += `installComponents(_sfc_main, {${result.join(',')}})\n`
    // Insert our modification before the HMR code
    const hotReload = code.indexOf('function _sfc_render')
    if (hotReload > -1) {
      code = code.slice(0, hotReload) + newContent + '\n\n' + code.slice(hotReload)
    } else {
      code += '\n\n' + newContent
    }
  }

  return code;
};

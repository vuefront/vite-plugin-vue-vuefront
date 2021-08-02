const j = require("jscodeshift");

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

const findImportTarget = ast => {
  let target = ast.find(j.ImportDeclaration, path =>
    path.source.value.startsWith("vuefront/lib"),
  );

  if (target.length === 0) {
    target = j.importDeclaration([], j.literal("vuefront/lib"));
    ast.get().node.program.body.unshift(target);

    return target;
  }

  return target.nodes()[0];
};

export default (code, components = [], config: VueFrontConfig) => {
  // const s = new MagicString(code)
  //
  // const head: string[] = []
  // for (const match of code.matchAll(/_c\(['"](.+?)["']([,)])/g)) {
  //   const [full, matchedName, append] = match
  //
  //   if (match.index != null && matchedName && !matchedName.startsWith('_')) {
  //     const start = match.index
  //     const end = start + full.length
  //     const name = pascalCase(matchedName)
  //     console.log('name')
  //     console.log(name)
  //     const regex = /^Vf(.)(.*)$/gm
  //
  //     const m = regex.exec(name)
  //
  //    
  //
  //     head.push(getImport(name, m[1], config, m[2], renderImport))
  //   }
  // }
  // s.prepend(`${head.join(';')};`)
  // console.log(s.toString())
  // return { code: s.toString() }
  // s.prepend()
  // const ast = j(code);
  // const importTarget = findImportTarget(ast);
  // const alreadyAdded = importTarget.specifiers
  //   .filter(path => path.type === j.ImportSpecifier.name)
  //   .map(path => path.local.name);
  // console.log(alreadyAdded)
  // const uniqImportSpecifiers = components
  // .filter(name => !alreadyAdded.includes(name))
  // .map(name => j.importSpecifier(j.identifier(name)));
  // importTarget.specifiers = [
  //   ...importTarget.specifiers,
  //   ...uniqImportSpecifiers,
  // ];
  // console.log(ast.toSource())
  // return ast.toSource();
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

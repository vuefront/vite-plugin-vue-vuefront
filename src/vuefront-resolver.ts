import setupConfig from './setupConfig'

const config = setupConfig(process.cwd())
export const resolveComponent = (name: string, type: string, tag: string) => {
  let comImport = false

  switch (type) {
    case 'A':
    if(!config.atoms[name]) {
      return
    }
    comImport = config.atoms[name]
    break;
    case 'M':
    if(!config.molecules[name]) {
      return
    }
    comImport = config.molecules[name]
    break;
    case 'O':
    if(!config.organisms[name]) {
      return
    }
    comImport = config.organisms[name]
    break;
    case 'T':
    if(!config.templates[name]) {
      return
    }
    comImport = config.templates[name]
    break;
    case 'L':
    if(!config.loaders[name]) {
      return
    }
    comImport = config.loaders[name]
    break;
    case 'E':
    if(!config.extensions[name]) {
      return
    }
    comImport = config.extensions[name]
    break;
  }
  return comImport
}
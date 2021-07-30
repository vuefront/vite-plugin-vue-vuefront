interface VueFrontComponent {
    component?: string
    css?: string
    type?: VueFrontPathType
    path?: string
  }
  type VueFrontComponentList = {
    [key: string]: VueFrontComponent | string
  }
  
  type VueFrontConfigRoot = {
    components?: string
    store?: string
    locales?: string
  }
  
  
  type VueFrontComponentKey = 'atoms' | 'molecules' | 'organisms' | 'templates' | 'pages' | 'loaders' | 'extensions'

//  export const enum VueFrontComponentKey {
//     atoms = 'atoms',
//     molecules = 'molecules',
//     organisms = 'organisms',
//     templates = 'templates',
//     pages = 'pages',
//     loaders = 'loaders',
//     extensions = 'extension'
//   }
  
  type VueFrontConfigComponents = {
    [key in VueFrontComponentKey]?: VueFrontComponentList;
  }
  
  type VuefrontStore = {
    path?: string,
    module?: string | VuefrontStoreModule
  }
  type VuefrontStoreModule = {
    type: VueFrontPathType
    path: string
    component?: string
  }
  
  type VuefrontLocaleModule = {
    type: VueFrontPathType
    path: string
    component?: string
  }
  
  type VuefrontStoreList = {
    [key: string]: VuefrontStore
  }
  
  interface VueFrontConfig extends VueFrontConfigComponents {
    root?: VueFrontConfigRoot;
    store?: VuefrontStoreList;
    theme?: string;
    app?: string[];
    locales?: VuefrontLocalesList;
    seo?: VueFrontSeoList;
    image?: VueFrontImageList;
  }

  type VueFrontImage = {
    path: string
    width: string
    height: string
  }

  type VueFrontImageList = {
    [key: string]: VueFrontImage
  }

  type VueFrontSeoList = {
    [key: string]: VueFrontSeo
  }

  type VueFrontSeoResult = {
    id: string
    url: string
  }

  type VueFrontSeo = {
    component: string
    generate: boolean
    seo(): VueFrontSeoResult
  }
  
  type VuefrontLocalesList = {
    [key: string]: Array<string | VuefrontLocaleModule>
  }

  type VueFrontPathType = 'full' | 'inside'
  
  type VueFrontConvertComponent = {
    type: VueFrontPathType
    path: string
    component?: string
    css?: string
  }
  
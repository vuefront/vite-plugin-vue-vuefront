declare interface VueFrontComponent {
    component?: string
    css?: string
    type?: VueFrontPathType
    path?: string
  }
   type VueFrontComponentList = {
    [key: string]: VueFrontComponent | string
  }
  
  declare  type VueFrontConfigRoot = {
    components?: string
    store?: string
    locales?: string
  }

  
  declare  type VueFrontComponentKey = 'atoms' | 'molecules' | 'organisms' | 'templates' | 'pages' | 'loaders' | 'extensions'

//  export const enum VueFrontComponentKey {
//     atoms = 'atoms',
//     molecules = 'molecules',
//     organisms = 'organisms',
//     templates = 'templates',
//     pages = 'pages',
//     loaders = 'loaders',
//     extensions = 'extension'
//   }
  
declare type VueFrontConfigComponents = {
    [key in VueFrontComponentKey]?: VueFrontComponentList;
  }
  
  declare type VuefrontStore = {
    path?: string,
    module?: string | VuefrontStoreModule
  }
  declare type VuefrontStoreModule = {
    type: VueFrontPathType
    path: string
    component?: string
  }
  
  declare type VuefrontLocaleModule = {
    type: VueFrontPathType
    path: string
    component?: string
  }
  
  declare type VuefrontStoreList = {
    [key: string]: VuefrontStore
  }
  
  declare interface VueFrontConfig extends VueFrontConfigComponents {
    root?: VueFrontConfigRoot;
    store?: VuefrontStoreList;
    theme?: string;
    app?: string[];
    css?: string[];
    locales?: VuefrontLocalesList;
    seo?: VueFrontSeoList;
    image?: VueFrontImageList;
  }

  declare type VueFrontImage = {
    path: string
    image?: string
    width: string
    height: string
  }

  declare type VueFrontImageList = {
    [key: string]: VueFrontImage
  }

  declare type VueFrontSeoList = {
    [key: string]: VueFrontSeo
  }

  declare type VueFrontSeoResult = {
    id: string
    url: string
  }

  declare type VueFrontSeo = {
    component: string
    generate: boolean
    seo(): VueFrontSeoResult
  }
  
  declare type VuefrontLocalesList = {
    [key: string]: Array<string | VuefrontLocaleModule>
  }

  declare type VueFrontPathType = 'full' | 'inside'
  
  declare type VueFrontConvertComponent = {
    type: VueFrontPathType
    path: string
    component?: string
    css?: string
  }
  

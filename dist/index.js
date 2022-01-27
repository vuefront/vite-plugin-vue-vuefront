var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[Object.keys(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[Object.keys(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};

// src/utils.ts
function parseVueRequest(id) {
  const [filename, rawQuery] = id.split(`?`, 2);
  const query = qs.parse(rawQuery);
  if (query.vue != null) {
    query.vue = true;
  }
  if (query.src != null) {
    query.src = true;
  }
  if (query.index != null) {
    query.index = Number(query.index);
  }
  if (query.raw != null) {
    query.raw = true;
  }
  return {
    filename,
    query
  };
}
var qs, camelizeRE, camelize, capitalize2, hyphenateRE, hyphenate;
var init_utils = __esm({
  "src/utils.ts"() {
    qs = __toModule(require("querystring"));
    camelizeRE = /-(\w)/g;
    camelize = (str) => {
      return str.replace(camelizeRE, (_5, c) => c ? c.toUpperCase() : "");
    };
    capitalize2 = (str) => {
      return str.charAt(0).toUpperCase() + str.slice(1);
    };
    hyphenateRE = /\B([A-Z])/g;
    hyphenate = (str) => {
      return str.replace(hyphenateRE, "-$1").toLowerCase();
    };
  }
});

// src/vite/match.ts
var require_match = __commonJS({
  "src/vite/match.ts"(exports, module2) {
    init_utils();
    var normalize = (items) => items.map((item) => ({
      kebab: hyphenate(item),
      camel: capitalize2(camelize(item))
    }));
    var getComponents2 = (config2, tags) => {
      return normalize(tags).filter(({ kebab, camel }) => kebab.startsWith("vf-")).map(({ camel }) => camel);
    };
    module2.exports = {
      getComponents: getComponents2
    };
  }
});

// src/index.ts
__export(exports, {
  default: () => src_default,
  vuefront: () => vuefront
});

// src/setupConfig.ts
var _ = __toModule(require("lodash"));
var import_vuefront = __toModule(require("vuefront"));
var rootPath = "";
var mergeConfig = (objValue, srcValue, index) => {
  if (index !== "locales") {
    if (_.isArray(objValue)) {
      return _.concat(objValue, srcValue);
    } else if (_.isObject(objValue)) {
      return _.merge(objValue, srcValue);
    } else {
      return srcValue;
    }
  } else if (_.includes(["atoms", "layouts", "molecules", "organisms", "extensions"], index)) {
    if (_.isArray(objValue)) {
      return _.concat(objValue, srcValue);
    } else if (_.isObject(objValue)) {
      return _.merge(objValue, srcValue);
    } else {
      return srcValue;
    }
  } else {
    return _.mergeWith(objValue, srcValue, mergeConfig);
  }
};
var checkPath = (path3) => {
  const newPath = _.replace(path3, /^(~)/, rootPath + "/src");
  try {
    require.resolve(newPath);
    return true;
  } catch (e) {
    return false;
  }
};
var convertComponentPath = (items, root) => {
  let result = {};
  if (!items) {
    return;
  }
  const category = items;
  for (const key in category) {
    let component = void 0;
    let css = void 0;
    if (typeof category[key] === "string") {
      component = category[key];
    } else {
      css = category[key].css;
      component = category[key].component;
    }
    let compResult = {};
    if (!_.isUndefined(component)) {
      if (checkPath(component)) {
        compResult = {
          type: "full",
          path: component
        };
      } else if (checkPath(root + "/" + component)) {
        compResult = {
          type: "full",
          path: root + "/" + component
        };
      } else {
        compResult = {
          type: "inside",
          path: root,
          component
        };
      }
    }
    if (!_.isUndefined(css)) {
      if (checkPath(css)) {
        compResult = __spreadProps(__spreadValues({}, compResult), {
          css
        });
      } else if (checkPath(root + "/" + css)) {
        compResult = __spreadProps(__spreadValues({}, compResult), {
          css: root + "/" + css
        });
      }
    }
    result[key] = compResult;
  }
  return result;
};
var convertPath = (config2) => {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m;
  const result = {};
  if (config2.atoms) {
    result.atoms = convertComponentPath(config2.atoms, ((_a = config2.root) == null ? void 0 : _a.components) || "");
  }
  if (config2.molecules) {
    result.molecules = convertComponentPath(config2.molecules, ((_b = config2.root) == null ? void 0 : _b.components) || "");
  }
  if (config2.organisms) {
    result.organisms = convertComponentPath(config2.organisms, ((_c = config2.root) == null ? void 0 : _c.components) || "");
  }
  if (config2.templates) {
    result.templates = convertComponentPath(config2.templates, ((_d = config2.root) == null ? void 0 : _d.components) || "");
  }
  if (config2.pages) {
    result.pages = convertComponentPath(config2.pages, ((_e = config2.root) == null ? void 0 : _e.components) || "");
  }
  if (config2.loaders) {
    result.loaders = convertComponentPath(config2.loaders, ((_f = config2.root) == null ? void 0 : _f.components) || "");
  }
  if (config2.extensions) {
    result.extensions = convertComponentPath(config2.extensions, ((_g = config2.root) == null ? void 0 : _g.components) || "");
  }
  if (config2.store) {
    result.store = {};
    for (const key in config2.store) {
      let storeResult = config2.store[key];
      if (_.isArray(storeResult.path)) {
        storeResult.path = storeResult.path.join("|modules|").split("|");
      }
      if (!config2.store[key].module) {
        storeResult = config2.store[key];
      } else {
        if (typeof config2.store[key].module === "string") {
          if (checkPath(config2.store[key].module)) {
            storeResult.module = {
              type: "full",
              path: config2.store[key].module
            };
          } else if (checkPath(((_h = config2 == null ? void 0 : config2.root) == null ? void 0 : _h.store) + "/" + config2.store[key].module)) {
            storeResult.module = {
              type: "full",
              path: ((_i = config2 == null ? void 0 : config2.root) == null ? void 0 : _i.store) + "/" + config2.store[key].module
            };
          } else {
            storeResult.module = {
              type: "inside",
              path: ((_j = config2 == null ? void 0 : config2.root) == null ? void 0 : _j.store) || "",
              component: config2.store[key].module
            };
          }
        }
      }
      let storeKey = "";
      if (_.isArray(storeResult.path)) {
        storeKey = storeResult.path.map((val) => _.capitalize(val)).join("");
      }
      if (_.isString(storeResult == null ? void 0 : storeResult.path)) {
        storeKey = storeResult.path;
      }
      if (result.store) {
        result.store[storeKey] = storeResult;
      }
    }
  }
  if (config2.locales) {
    result.locales = {};
    for (const key in config2.locales) {
      result.locales[key] = [];
      const locale = config2.locales[key];
      for (const key2 in locale) {
        const locale2 = locale[key2];
        if (typeof locale2 === "string") {
          if (checkPath(locale2)) {
            result.locales[key].push({
              type: "full",
              path: locale2
            });
          } else if (checkPath(((_k = config2 == null ? void 0 : config2.root) == null ? void 0 : _k.locales) + "/" + locale2)) {
            result.locales[key].push({
              type: "full",
              path: ((_l = config2 == null ? void 0 : config2.root) == null ? void 0 : _l.locales) + "/" + locale2
            });
          } else {
            result.locales[key].push({
              type: "inside",
              path: ((_m = config2.root) == null ? void 0 : _m.locales) || "",
              component: locale2
            });
          }
        }
      }
    }
  }
  return result;
};
var cloneConfig = (config2) => {
  return JSON.parse(JSON.stringify(config2));
};
var setupConfig_default = (rootDir) => {
  let themeOptions = {};
  themeOptions = cloneConfig(import_vuefront.default);
  rootPath = rootDir;
  themeOptions = __spreadValues(__spreadValues({}, themeOptions), convertPath(import_vuefront.default));
  delete require.cache[require.resolve(rootDir + "/vuefront.config")];
  const themeConfig = require(rootDir + "/vuefront.config");
  let config2 = cloneConfig(themeConfig);
  config2 = __spreadValues(__spreadValues({}, config2), convertPath(config2));
  if (typeof config2.app !== "undefined") {
    for (const key in config2.app) {
      delete require.cache[require.resolve(config2.app[key])];
      let customAppConfig = require(config2.app[key]);
      customAppConfig = customAppConfig.default || customAppConfig;
      let customAppOptions = cloneConfig(customAppConfig);
      customAppOptions = __spreadValues(__spreadValues({}, customAppOptions), convertPath(customAppOptions));
      themeOptions = _.mergeWith(themeOptions, customAppOptions, mergeConfig);
    }
  }
  if (typeof config2.theme !== "undefined") {
    delete require.cache[require.resolve(config2.theme)];
    let customThemeConfig = require(config2.theme);
    customThemeConfig = customThemeConfig.default || customThemeConfig;
    let customThemeOptions = cloneConfig(customThemeConfig);
    customThemeOptions = __spreadValues(__spreadValues({}, customThemeOptions), convertPath(customThemeOptions));
    themeOptions = _.mergeWith(themeOptions, customThemeOptions, mergeConfig);
  }
  themeOptions = _.mergeWith(themeOptions, config2, mergeConfig);
  return themeOptions;
};

// src/setupRoutes.ts
var _2 = __toModule(require("lodash"));
var convertComponent = (component, config2) => {
  if (!config2.pages) {
    return "";
  }
  if (config2.pages[component].type === "full") {
    return `import('${config2.pages[component].path}')`;
  } else {
    return `import('${config2.pages[component].path}').then((m) => {
      let component = m.${config2.pages[component].component}
      component = component.default || component
      return component
    })`;
  }
};
var convertLoader = (component, config2) => {
  if (!config2.loaders) {
    return "";
  }
  if (config2.loaders[component].type === "full") {
    return `() => import('${config2.loaders[component].path}')`;
  } else {
    return `() => import('${config2.loaders[component].path}').then((m) => {
      let component = m.${config2.loaders[component].component}
      component = component.default || component
      return component
    })`;
  }
};
var setupRoutes_default = (config2) => {
  let whiteList = [];
  let exclude = [];
  let routes = [];
  for (const url in config2.seo) {
    const pageComponent = config2.seo[url];
    if (!_2.isUndefined(pageComponent.generate) && pageComponent.generate) {
      whiteList = [...whiteList, url];
    } else if (_2.isUndefined(pageComponent.generate) && !url.includes(":")) {
      whiteList = [...whiteList, url];
    } else {
      exclude = [...exclude, url];
    }
    const props = {};
    if (pageComponent.loader) {
      props.loader = convertLoader(pageComponent.loader, config2);
    }
    routes.push({
      name: url.replace("/", "_").replace(":", "_"),
      path: url,
      props,
      component: convertComponent(pageComponent.component, config2)
    });
  }
  return {
    routes,
    whiteList,
    exclude
  };
};

// src/setupImages.ts
var _3 = __toModule(require("lodash"));
var setupImages_default = (config2) => {
  let result = {};
  let images = {};
  if (config2.images) {
    images = _3.merge(images, config2.images);
  }
  if (config2.image) {
    images = _3.merge(images, config2.image);
  }
  for (const key in images) {
    const image = images[key];
    result[key] = {
      image: "",
      path: ""
    };
    if (_3.isString(image)) {
      result[key].image = `await import('${image}?url')`;
    } else if (_3.isObject(image)) {
      if (image.path) {
        result[key].image = `await import('${image.path}?url')`;
      }
      if (image.width && image.height) {
        result[key].width = image.width;
        result[key].height = image.height;
      }
    }
  }
  return result;
};

// src/index.ts
var path2 = __toModule(require("path"));
var fs2 = __toModule(require("fs"));
var _4 = __toModule(require("lodash"));

// src/vite/load.ts
var import_compiler_sfc = __toModule(require("@vue/compiler-sfc"));
var fs = __toModule(require("fs"));
var path = __toModule(require("path"));
var readFile2 = (path3) => new Promise((resolve3, reject) => {
  fs.readFile(path3, (err, data) => {
    if (err) {
      reject(err);
    } else {
      resolve3(data.toString());
    }
  });
});
var load = async (id) => {
  const filename = id.replace(/\?.*/, "");
  const content = (await readFile2(filename)).toString();
  const component = (0, import_compiler_sfc.parse)(content);
  const script = component.descriptor.script && component.descriptor.script.content;
  let template2, isExternalScript, scriptPath;
  if (component.descriptor.template) {
    if (component.descriptor.template.src) {
      template2 = (await readFile2(path.resolve(path.dirname(filename), component.descriptor.template.src))).toString();
    } else {
      template2 = component.descriptor.template.content;
    }
    if (component.descriptor.script && component.descriptor.script.src) {
      scriptPath = path.resolve(path.dirname(filename), component.descriptor.script.src);
      isExternalScript = true;
    }
  }
  return { template: template2, script, scriptPath, isExternalScript };
};

// src/vite/extract.ts
var import_compiler_sfc2 = __toModule(require("@vue/compiler-sfc"));
var { getComponents } = require_match();
var extract_default = (template2, filename, config2) => {
  const result = (0, import_compiler_sfc2.compileTemplate)({
    source: template2,
    filename,
    id: "vuefront",
    compilerOptions: {}
  });
  return {
    components: getComponents(config2, result.ast ? [...result.ast.components] : [])
  };
};

// src/vite/transform.ts
var renderImport = (component, tag) => {
  let result = "";
  if (!component) {
    return "";
  }
  if (component.type === "full") {
    result = `import ${tag} from '${component.path}';`;
  } else {
    result = `import {${component.component}} from '${component.path}';`;
  }
  return result;
};
var renderImportCss = (component, tag) => {
  let result = "";
  if (component.css) {
    result += `import "${component.css}"`;
  }
  return result;
};
var getImport = (name, type, config2, tag, renderImport2) => {
  let comImport = false;
  switch (type) {
    case "A":
      if (!config2.atoms || !config2.atoms[name]) {
        return;
      }
      comImport = renderImport2(config2.atoms[name], tag);
      break;
    case "M":
      if (!config2.molecules || !config2.molecules[name]) {
        return;
      }
      comImport = renderImport2(config2.molecules[name], tag);
      break;
    case "O":
      if (!config2.organisms || !config2.organisms[name]) {
        return;
      }
      comImport = renderImport2(config2.organisms[name], tag);
      break;
    case "T":
      if (!config2.templates || !config2.templates[name]) {
        return;
      }
      comImport = renderImport2(config2.templates[name], tag);
      break;
    case "L":
      if (!config2.loaders || !config2.loaders[name]) {
        return;
      }
      comImport = renderImport2(config2.loaders[name], tag);
      break;
    case "E":
      if (!config2.extensions || !config2.extensions[name]) {
        return;
      }
      comImport = renderImport2(config2.extensions[name], tag);
      break;
  }
  return comImport;
};
var transform_default = (code, components = [], config2, descriptor) => {
  const imports = [];
  for (const tag of components) {
    const regex = /^Vf(.)(.*)$/gm;
    const m = regex.exec(tag);
    if (!m) {
      continue;
    }
    const type = m[1];
    const name = m[2];
    let comImport = getImport(name, type, config2, tag, renderImport);
    let comImportCss = getImport(name, type, config2, tag, renderImportCss);
    imports.push([tag, comImport, comImportCss]);
  }
  if (imports.length) {
    let newContent = "/* vuefront-loader */\n";
    newContent += `import installComponents from "vite-plugin-vue-vuefront/installComponents"
`;
    newContent += imports.map((i) => i[2]).join("\n") + "\n";
    let result = [];
    for (const item of imports) {
      newContent += item[1];
      result.push(`${item[0]}`);
    }
    const sfcMain = code.indexOf("_sfc_main");
    const hotReload = code.indexOf("function _sfc_render");
    const exportDefault = code.indexOf("export default /* @__PURE__ */ _defineComponent({");
    if (hotReload > -1) {
      newContent += `installComponents(_sfc_main, {${result.join(",")}})
`;
      code = code.slice(0, hotReload) + newContent + "\n\n" + code.slice(hotReload);
    } else if (exportDefault > -1) {
      code = code.slice(0, exportDefault) + newContent + "\n\nexport default /* @__PURE__ */ _defineComponent({components:{" + result.join(",") + "}," + code.slice(exportDefault + 49);
    } else if (sfcMain > -1) {
      newContent += `installComponents(_sfc_main, {${result.join(",")}})
`;
      code += "\n\n" + newContent;
    }
  }
  return code;
};

// src/index.ts
var import_dotenv = __toModule(require("dotenv"));
init_utils();
var import_micromatch = __toModule(require("micromatch"));
var import_chalk = __toModule(require("chalk"));
(0, import_dotenv.config)();
var externalScriptTemplate = new Map();
function touch(path3) {
  const time = new Date();
  try {
    fs2.utimesSync(path3, time, time);
  } catch (err) {
    fs2.closeSync(fs2.openSync(path3, "w"));
  }
}
var extractAndTransform = (code, template2 = "", descriptor, config2) => {
  if (typeof template2 !== "string" || !template2.trim()) {
    return code;
  }
  const { components } = extract_default(template2, descriptor.filename, config2);
  return transform_default(code, components, config2, descriptor);
};
function pluginVueFront(options = {}) {
  const vuefrontRoutesId = "@vuefront-routes";
  const vuefrontPluginId = "@vuefront-plugin";
  const vuefrontCreateApp = "@vuefront-create-app";
  const vuefrontPlugins = [
    "@vuefront-client",
    "@vuefront-cookie",
    "@vuefront-seo-resolver",
    "@vuefront-i18n",
    "@vuefront-store",
    "@vuefront-apollo"
  ];
  const css = [];
  const themeOptions = setupConfig_default(process.cwd());
  if (themeOptions.css) {
    for (const key in themeOptions.css) {
      css.push(themeOptions.css[key]);
    }
  }
  let { routes } = setupRoutes_default(themeOptions);
  const images = setupImages_default(themeOptions);
  const defaultPort = process.env.API_PORT || process.env.PORT || process.env.npm_package_config_nuxt_port || 3e3;
  let defaultHost = process.env.API_HOST || process.env.HOST || process.env.npm_package_config_nuxt_host || "localhost";
  if (defaultHost === "0.0.0.0") {
    defaultHost = "localhost";
  }
  const prefix = process.env.API_PREFIX || options.prefix || options.targetUrl;
  let browserBaseURL = null;
  let baseURL = `http://${defaultHost}:${defaultPort}${prefix}`;
  if (process.env.API_URL) {
    baseURL = process.env.API_URL;
  }
  if (process.env.API_URL_BROWSER) {
    browserBaseURL = process.env.API_URL_BROWSER;
  }
  if (!browserBaseURL) {
    if (options.proxy && prefix) {
      browserBaseURL = prefix;
    } else {
      browserBaseURL = baseURL;
    }
  }
  const pathPlatform = process.platform === "win32" ? path2.win32 : path2.posix;
  let timerState = "reload";
  let timer;
  function clear() {
    clearTimeout(timer);
  }
  function schedule(fn) {
    clear();
    timer = setTimeout(fn, 500);
  }
  return {
    name: "vite-plugin-vue-vuefront",
    configureServer(server) {
      let filesToRestart = [
        "vuefront.config.js",
        "node_modules/vuefront/index.js",
        "node_modules/@vuefront/checkout-app/index.js"
      ];
      let filesToReload = [
        "node_modules/vuefront/assets/**",
        "node_modules/vuefront/tailwind/**",
        "node_modules/vuefront/lib/**",
        "node_modules/@vuefront/checkout-app/lib/**"
      ];
      filesToReload = filesToReload.map((file) => path2.resolve(process.cwd(), file));
      filesToRestart = filesToRestart.map((file) => path2.resolve(process.cwd(), file));
      server.watcher.add([...filesToRestart, ...filesToReload]);
      server.watcher.on("change", (file) => {
        if (import_micromatch.default.isMatch(file, filesToRestart)) {
          timerState = "restart";
          schedule(() => {
            touch("vite.config.ts");
            console.log(import_chalk.default.dim(new Date().toLocaleTimeString()) + import_chalk.default.bold.blue` [plugin-restart] ` + import_chalk.default.yellow`restarting server by ${pathPlatform.relative(process.cwd(), file)}`);
            timerState = "";
          });
        }
      });
    },
    config(config2, env) {
      if (!config2.server)
        config2.server = {};
      if (!config2.server.watch)
        config2.server.watch = {};
      config2.server.watch.disableGlobbing = false;
      if (!config2.server.watch.ignored) {
        config2.server.watch.ignored = [];
        config2.server.watch.ignored.push("!**/node_modules/vuefront/**");
        config2.server.watch.ignored.push("!**/node_modules/@vuefront/checkout-app/**");
      }
      if (!config2.optimizeDeps) {
        config2.optimizeDeps = {};
      }
      if (!config2.optimizeDeps.include) {
        config2.optimizeDeps.include = [];
      }
      if (!config2.optimizeDeps.exclude) {
        config2.optimizeDeps.exclude = [];
      }
      config2.optimizeDeps.include = [
        ...config2.optimizeDeps.include,
        "omit-deep-lodash",
        "apollo-boost",
        "isomorphic-fetch",
        "vue-meta/ssr",
        "cookie",
        "vite-plugin-vue-vuefront/installComponents"
      ];
      config2.optimizeDeps.exclude = [
        ...config2.optimizeDeps.exclude,
        "vue-demi"
      ];
      if (!config2.build) {
        config2.build = {};
      }
      if (!config2.build.rollupOptions) {
        config2.build.rollupOptions = {};
      }
      if (!config2.build.rollupOptions.output) {
        config2.build.rollupOptions.output = {};
      }
      config2.build.rollupOptions.output.inlineDynamicImports = false;
      config2.build.rollupOptions.output.manualChunks = (id) => {
        if (id.includes("node_modules/vuefront") || id.includes("node_modules/@vuefront")) {
          return "vuefront";
        }
      };
      return config2;
    },
    async transform(src, id) {
      if (/vue&type=graphql/.test(id)) {
        src = src.replace("export default doc", "");
        return `export default Comp => {
          ${src}
          Comp.query = doc
        }`;
      }
      const descriptor = parseVueRequest(id);
      if (externalScriptTemplate.has(id)) {
        return extractAndTransform(src, externalScriptTemplate.get(id), descriptor, themeOptions);
      } else if (/.*\.vue([?].*)?$/.test(id)) {
        const source = await load(id);
        if (source.isExternalScript) {
          externalScriptTemplate.set(source.scriptPath, source.template);
          return;
        } else if (/\.*vue$/i.test(id) || !source.script) {
          if (typeof source.script === "string" && source.script.trim() === "") {
            src = "export default {}";
          }
          return extractAndTransform(src, source.template, descriptor, themeOptions);
        }
      }
      return src;
    },
    resolveId(id) {
      if (_4.includes(vuefrontPlugins, id)) {
        return id;
      }
      if (id === vuefrontCreateApp) {
        return vuefrontCreateApp;
      }
      if (id === vuefrontRoutesId) {
        return vuefrontRoutesId;
      }
      if (id === vuefrontPluginId) {
        return vuefrontPluginId;
      }
    },
    load(id) {
      if (_4.includes(vuefrontPlugins, id)) {
        const routesContent = fs2.readFileSync(path2.resolve(__dirname, "../templates/" + id + ".js"));
        let compiled = _4.template(routesContent.toString());
        return compiled({
          options: {
            browserBaseURL,
            baseURL,
            themeOptions
          }
        });
      }
      if (id === vuefrontCreateApp) {
        const routesContent = fs2.readFileSync(path2.resolve(__dirname, "../templates/@vuefront-create-app.js"));
        let compiled = _4.template(routesContent.toString());
        return compiled({ options: { themeOptions } });
      }
      if (id === vuefrontRoutesId) {
        const routesContent = fs2.readFileSync(path2.resolve(__dirname, "../templates/@vuefront-routes.js"));
        let compiled = _4.template(routesContent.toString());
        return compiled({ options: { routes } });
      }
      if (id === vuefrontPluginId) {
        const pluginContent = fs2.readFileSync(path2.resolve(__dirname, "../templates/@vuefront-plugin.js"));
        let compiled = _4.template(pluginContent.toString());
        return compiled({
          options: {
            css,
            browserBaseURL,
            baseURL,
            themeOptions,
            images
          }
        });
      }
    }
  };
}
var src_default = pluginVueFront;
var vuefront = pluginVueFront;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  vuefront
});

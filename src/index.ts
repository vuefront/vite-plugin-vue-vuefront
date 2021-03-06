import type { Plugin } from 'vite'
import type { VitePluginVueVueFrontOptions } from './options'
import setupConfig from './setupConfig'
import setupRoutes from './setupRoutes'
import setupImages from './setupImages'
import * as path from 'path'
import * as fs from 'fs'
import * as _ from 'lodash'
import {load} from './vite/load'
import extract from './vite/extract'
import transform from './vite/transform'
import { config } from "dotenv";
import { parseVueRequest, VueQuery } from './utils'
import micromatch from 'micromatch'
import chalk from 'chalk'
export * from './options'
config()
const externalScriptTemplate = new Map();

function touch(path: string) {
  const time = new Date()

  try {
    fs.utimesSync(path, time, time)
  }
  catch (err) {
    fs.closeSync(fs.openSync(path, 'w'))
  }
}

const extractAndTransform = (code: string, template = "", descriptor: {filename: string; query: VueQuery }, config: VueFrontConfig) => {
  if (typeof template !== "string" || !template.trim()) {
    return code;
  }

  const { components } = extract(template, descriptor.filename, config);

  return transform(code, components, config, descriptor)
};

function pluginVueFront(
  options: VitePluginVueVueFrontOptions = {}
): Plugin {
  
  const vuefrontRoutesId = '@vuefront-routes'
  const vuefrontPluginId = '@vuefront-plugin'
  const vuefrontCreateApp = '@vuefront-create-app'
  const vuefrontPlugins = [
    '@vuefront-client',
    '@vuefront-cookie',
    '@vuefront-seo-resolver',
    '@vuefront-i18n',
    "@vuefront-store",
    "@vuefront-apollo"
  ]

  const css: string[] = []

  const themeOptions = setupConfig(process.cwd())

  if(themeOptions.css) {
    for (const key in themeOptions.css) {
      css.push(themeOptions.css[key])

    }
  }

  let { routes } = setupRoutes(themeOptions)

  const images = setupImages(themeOptions)

  const defaultPort =
    process.env.API_PORT ||
    process.env.PORT ||
    process.env.npm_package_config_nuxt_port ||
    3000

  // Default host
  let defaultHost =
    process.env.API_HOST ||
    process.env.HOST ||
    process.env.npm_package_config_nuxt_host ||
    'localhost'

  /* istanbul ignore if */
  if (defaultHost === '0.0.0.0') {
    defaultHost = 'localhost'
  }

  const prefix =
    process.env.API_PREFIX || options.prefix || options.targetUrl
  let browserBaseURL: string | null = null
  let baseURL = `http://${defaultHost}:${defaultPort}${prefix}`

  if (process.env.API_URL) {
    baseURL = process.env.API_URL
  }

  if (process.env.API_URL_BROWSER) {
    browserBaseURL = process.env.API_URL_BROWSER
  }

  if (!browserBaseURL) {
    if (options.proxy && prefix) {
      browserBaseURL = prefix
    } else {
      browserBaseURL = baseURL
    }
  }

  const pathPlatform = process.platform === 'win32' ? path.win32 : path.posix

  let timerState = 'reload'

  let timer: number | undefined

  function clear() {
    clearTimeout(timer)
  }
  function schedule(fn: () => void) {
    clear()
    timer = setTimeout(fn, 500) as any as number
  }

  return {
    name: 'vite-plugin-vue-vuefront',
    configureServer(server) {
      let filesToRestart = [
        'vuefront.config.js',
        'node_modules/vuefront/index.js',
        'node_modules/@vuefront/checkout-app/index.js',
      ]

      let filesToReload = [
        'node_modules/vuefront/assets/**',
        'node_modules/vuefront/tailwind/**',
        'node_modules/vuefront/lib/**',
        'node_modules/@vuefront/checkout-app/lib/**'
      ]
      filesToReload = filesToReload.map(file => path.resolve(process.cwd(), file))
      filesToRestart = filesToRestart.map(file => path.resolve(process.cwd(), file))

      server.watcher.add([...filesToRestart, ...filesToReload])

      server.watcher.on(
        'change',
        (file) => {
          if (micromatch.isMatch(file, filesToRestart)) {
            timerState = 'restart'
            schedule(() => {
              touch('vite.config.ts')
              console.log(
                chalk.dim(new Date().toLocaleTimeString())
                + chalk.bold.blue` [plugin-restart] `
                + chalk.yellow`restarting server by ${pathPlatform.relative(process.cwd(), file)}`,
              )
              timerState = ''
            })
          }
        },
      )
    },
    config(config, env) {
      if (!config.server)
      config.server = {}
      if (!config.server.watch)
      config.server.watch = {}
      config.server.watch.disableGlobbing = false
      if (!config.server.watch.ignored) {
        config.server.watch.ignored = []
        config.server.watch.ignored.push('!**/node_modules/vuefront/**')
        config.server.watch.ignored.push('!**/node_modules/@vuefront/checkout-app/**')
      }
      if (!config.optimizeDeps) {
        config.optimizeDeps = {}
      }

      if (!config.optimizeDeps.include) {
        config.optimizeDeps.include = []
      }
      if (!config.optimizeDeps.exclude) {
        config.optimizeDeps.exclude = []
      }
      config.optimizeDeps.include = [
        ...config.optimizeDeps.include,
        "omit-deep-lodash",
        "apollo-boost",
        "isomorphic-fetch",
        "vue-meta/ssr",
        "cookie",
        "vite-plugin-vue-vuefront/installComponents",
      ]

      config.optimizeDeps.exclude = [
        ...config.optimizeDeps.exclude,
        "vue-demi"
      ]

      if (!config.build) {
        config.build = {}
      }
      if (!config.build.rollupOptions) {
        config.build.rollupOptions = {}
      }
      if (!config.build.rollupOptions.output) {
        config.build.rollupOptions.output = {}
      }

      (config.build.rollupOptions.output as any).inlineDynamicImports = false;
      (config.build.rollupOptions.output as any).manualChunks = (id: string) =>  {
        if (
          id.includes("node_modules/vuefront") ||
          id.includes("node_modules/@vuefront")
        ) {
          return "vuefront";
        }
      }

      return config
    },
    async transform(src, id) {
      if (/vue&type=graphql/.test(id)) {
        src = src.replace('export default doc', '')
        return `export default Comp => {
          ${src}
          Comp.query = doc
        }`
      }
      const descriptor = parseVueRequest(id)

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
      return src
    },
    resolveId(id) {
      if (_.includes(vuefrontPlugins,id)) {
        return id
      }
      if (id === vuefrontCreateApp) {
        return vuefrontCreateApp
      }
      if (id === vuefrontRoutesId) {
        return vuefrontRoutesId
      }
      if (id === vuefrontPluginId) {
        return vuefrontPluginId
      }
    },
    load(id) {
      if (_.includes(vuefrontPlugins,id)) {
        const routesContent = fs.readFileSync(path.resolve(__dirname, '../templates/'+id+'.js'));
        let compiled = _.template(routesContent.toString())

        return compiled({
          options: {
            browserBaseURL,
            baseURL,
            themeOptions
          }
        })
      }
      if (id === vuefrontCreateApp) {
        const routesContent = fs.readFileSync(path.resolve(__dirname, '../templates/@vuefront-create-app.js'));
        let compiled = _.template(routesContent.toString())
        return compiled({ options: { themeOptions } })
      }
      if (id === vuefrontRoutesId) {
        const routesContent = fs.readFileSync(path.resolve(__dirname, '../templates/@vuefront-routes.js'));
        let compiled = _.template(routesContent.toString())
        return compiled({ options: { routes } })
      }
      if (id === vuefrontPluginId) {
        const pluginContent = fs.readFileSync(path.resolve(__dirname, '../templates/@vuefront-plugin.js'));
        let compiled = _.template(pluginContent.toString())

        return compiled({
          options: {
            css,
            browserBaseURL,
            baseURL,
            themeOptions,
            images
          }
        })

      }
    }
  }
}

export default pluginVueFront
export const vuefront = pluginVueFront
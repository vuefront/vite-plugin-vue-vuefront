import {compileTemplate} from '@vue/compiler-sfc'
const { getComponents } = require("./match");

export default (template: string, filename, config: VueFrontConfig) => {
  const result = compileTemplate({
    source: template,
    filename,
    id: 'vuefront',
     compilerOptions: {
      
    }
  })

  return {
    components: getComponents(config, [...result.ast.components]),
  };
}

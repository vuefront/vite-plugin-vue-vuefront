import { ASTElement, compile } from "vue-template-compiler";
const { getComponents } = require("./match");

export default (template: string, filename: string, config: VueFrontConfig) => {
  const result = compileTemplate({
    source: template,
    filename,
    id: 'vuefront',
    compilerOptions: {
      
    }
  })

  return {
    components: getComponents(config, result.ast ? [...result.ast.components] : []),
  };
}

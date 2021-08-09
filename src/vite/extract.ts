import { ASTElement, compile } from "vue-template-compiler";
const { getComponents } = require("./match");

export default (template: string, filename: string, config: VueFrontConfig) => {
  let tags = new Set<string>();

  compile(template, {
    modules: [
      //@ts-ignore
      {
        postTransformNode: (node: ASTElement): void => {
          tags.add(node.tag);
        },
      },
    ],
  });

  return {
    components: getComponents(config, [...tags]),
  };
}

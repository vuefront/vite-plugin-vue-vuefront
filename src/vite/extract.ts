const { compile } = require("vue-template-compiler");
const { getComponents } = require("./match");

export default (template: string, filename, config: VueFrontConfig) => {
  let tags = new Set();

  compile(template, {
    modules: [
      {
        postTransformNode: node => {
          tags.add(node.tag);
        },
      },
    ],
  });

  return {
    components: getComponents(config, [...tags]),
  };
}

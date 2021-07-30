



const externalScriptTemplate = new Map();

module.exports = () => ({
  name: "vuetify",
  async transform(code, id) {
    if (externalScriptTemplate.has(id)) {
      return extractAndTransform(code, externalScriptTemplate.get(id));
    } else if (/.*\.vue/.test(id)) {
      const source = await load(id);

      if (source.isExternalScript) {
        externalScriptTemplate.set(source.scriptPath, source.template);
        return;
      } else if (/\.*vue\?rollup-plugin-vue=script((?!map).)*$/i.test(id) || !source.script) {
        if (typeof source.script === "string" && source.script.trim() === "") {
          code = "export default {}";
        }

        return extractAndTransform(code, source.template);
      }
    }
  },
});

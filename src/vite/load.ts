import { parseComponent } from "vue-template-compiler";
import * as fs from 'fs'
import * as path from 'path'

const readFile = path =>
  new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });

export const load = async id => {
  const filename = id.replace(/\?.*/, "");
  const content = (await readFile(filename)).toString();

  const component = parseComponent(content);
  const script = component.script && component.script.content;

  let template, isExternalScript, scriptPath;

  if (component.template) {
    if (component.template.src) {
      template = (
        await readFile(
          path.resolve(path.dirname(filename), component.template.src),
        )
      ).toString("utf8");
    } else {
      template = component.template.content;
    }

    if (component.script && component.script.src) {
      scriptPath = path.resolve(path.dirname(filename), component.script.src);
      isExternalScript = true;
    }
  }

  return { template, script, scriptPath, isExternalScript };
};

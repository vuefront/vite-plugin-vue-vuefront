import { parseComponent } from "vue-template-compiler";
import * as fs from 'fs'
import * as path from 'path'

const readFile = (path: string): Promise<string>  =>
  new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.toString());
      }
    });
  });

export const load = async (id: string) => {
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
      ).toString();
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

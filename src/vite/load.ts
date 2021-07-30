import {parse} from '@vue/compiler-sfc'
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

  const component = parse(content);
  const script = component.descriptor.script && component.descriptor.script.content;

  let template, isExternalScript, scriptPath;

  if (component.descriptor.template) {
    if (component.descriptor.template.src) {
      template = (
        await readFile(
          path.resolve(path.dirname(filename), component.descriptor.template.src),
        )
      ).toString();
    } else {
      template = component.descriptor.template.content;
    }

    if (component.descriptor.script && component.descriptor.script.src) {
      scriptPath = path.resolve(path.dirname(filename), component.descriptor.script.src);
      isExternalScript = true;
    }
  }

  return { template, script, scriptPath, isExternalScript };
};

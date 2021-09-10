import * as  _ from 'lodash'
import { camelize, capitalize, hyphenate } from '../utils'
type NormalizeComponent = {kebab: string; camel: string}
const normalize = (items: string[]): NormalizeComponent[] =>
  items.map(item => ({
    kebab: hyphenate(item),
    camel: capitalize(camelize(item)),
  }));

  const getComponents = (config: VueFrontConfig, tags: string[]) => {
    return normalize(tags)
    .filter(
      ({ kebab, camel }) => 
        kebab.startsWith('vf-'),
    )
    .map(({ camel }) => camel);
};

module.exports = {
  getComponents,
};

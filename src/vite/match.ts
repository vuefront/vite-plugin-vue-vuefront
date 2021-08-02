import * as  _ from 'lodash'
import { camelize, capitalize, hyphenate } from '../utils'
const normalize = items =>
  items.map(item => ({
    kebab: hyphenate(item),
    camel: capitalize(camelize(item)),
  }));

const getComponents = (config: VueFrontConfig, tags) => {
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

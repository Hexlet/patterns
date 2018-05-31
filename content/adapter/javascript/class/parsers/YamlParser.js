import { safeLoad, safeDump } from 'js-yaml';

export default class IniParser {
  constructor(options = {}) {
    this.options = options;
  }

  parse(text) {
    return safeLoad(text, this.options);
  }

  stringify(object) {
    return safeDump(object, this.options);
  }
}

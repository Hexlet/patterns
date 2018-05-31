import ini from 'ini';

export default class IniParser {
  constructor(options = {}) {
    this.options = options;
  }

  parse(text) {
    return ini.parse(text);
  }

  stringify(object) {
    return ini.stringify(object, this.options);
  }
}

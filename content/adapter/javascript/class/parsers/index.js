import IniParser from './IniParser';
import YamlParser from './YamlParser';

const parsers = {
  ini: IniParser,
  yaml: YamlParser,
};

export default (format, options) => {
  const Parser = parsers[format];
  if (!Parser) {
    throw new Error(`unkown format: ${format}`);
  }
  return new Parser(options);
};

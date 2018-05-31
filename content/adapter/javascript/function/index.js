import fs from 'fs';
import path from 'path';
import getParser from './parsers';

const configPath = 'path/to/eslint';
const format = path.extname(configPath).slice(1);
const data = fs.readSync(configPath);

const parser = getParser(format);
const config = parser.parse(data);
console.log(config);

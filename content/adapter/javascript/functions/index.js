import fs from 'fs';
import path from 'path';
import getParser from './parsers';

const configPath = 'path/to/eslint';
const ext = path.extname(configPath);
const data = fs.readSync(configPath);

const parser = getParser(ext);
const config = parser.parse(data);
console.log(config);

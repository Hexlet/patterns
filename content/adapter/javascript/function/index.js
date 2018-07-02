import highlight from 'prism';
import { codeToHtml } from './convertors';

const code = "const x = '5';";
const newHighlight = code => highlight({}, code);
const html = codeToHtml(code, newHighlight);
console.log(html);

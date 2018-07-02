import getRenderer from './renderers';

const data = {/* ... */};
const render = getRenderer('rss');
const xml = render(data);

console.log(xml);

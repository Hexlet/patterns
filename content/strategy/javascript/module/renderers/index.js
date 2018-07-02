import toAtom from './toAtom';
import toRSS from './toRss';

const renderers = {
  atom: toAtom,
  rss: toRSS,
};

export default (format) => {
  const render = renderers[format];
  if (!render) {
    throw new Error(`unkown format: ${format}`);
  }
  return render;
};

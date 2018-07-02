import Markdown from 'markdown';
import runApp from './app';

export default () => {
  const md = new Markdown();
  runApp(md);
};

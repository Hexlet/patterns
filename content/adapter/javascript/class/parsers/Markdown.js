import markdown from 'markdown';

export default class {
  constructor(options = {}) {
    this.options = options;
  }

  render(text) {
    return markdown.toHTML(text, 'gruber', this.options);
  }
}

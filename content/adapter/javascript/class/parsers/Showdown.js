import showdown from 'showdown';

export default class {
  constructor(options = {}) {
    this.converter = new showdown.Converter(options);
  }

  render(text) {
    return this.converter.makeHtml(text);
  }
}


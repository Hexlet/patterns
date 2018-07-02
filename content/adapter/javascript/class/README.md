### Адаптер (для классов)

Адаптер почти всегда начинается с того, что в проекте используется некоторая библиотека которую понадобилось подменить, а переписывать весь код под новую библиотеку, по тем или иным причинам, нельзя.

Допустим в проекте используется библиотека [remarkable](https://github.com/jonschlinkert/remarkable). Эта библиотека нужна для трансляции Markdown в HTML. Например Хекслет активно использует подобные библиотеки для своего контента как на клиентской стороне, так и на бекенде.

```javascript
import Remarkable from 'remarkable';

const md = new Remarkable();

console.log(md.render('# Remarkable rulezz!'));
// => <h1>Remarkable rulezz!</h1>
```

И в какой-то момент становится необходимым ее подменить. Такое происходит регулярно в моей практике когда речь идет о Markdown. Всегда выясняется что текущая библиотека не поддерживает какую-нибудь важную функцию или перестала поддерживаться. Если в вашем проекте Markdown библиотека инъектируется в нужные функции, то заменить ее становится проще простого. Достаточно создать объект другой библиотеки так чтобы совпадали интерфейсы. Кстати в случае с библиотекой [markdown-it](https://github.com/markdown-it/markdown-it) делать ничего не придется вообще. Ее интерфейс и так совпадает с Remarkable.

```javascript
import Markdown from 'markdown-it';

const md = new Markdown();
console.log(md.render('# markdown-it rulezz!'));
```

А вот в случае с библиотеками [markdown-js](https://github.com/evilstreak/markdown-js) и [showdown](https://github.com/showdownjs/showdown) придется написать адаптеры.

```javascript
import showdown from 'showdown';

export default class {
  constructor(options = {}) {
    this.converter = new showdown.Converter(options);
  }

  render(text) {
    return this.converter.makeHtml(text);
  }
}
```

```javascript
import markdown from 'markdown';

export default class {
  constructor(options = {}) {
    this.options = options;
  }

  render(text) {
    return markdown.toHTML(text, 'gruber', this.options);
  }
}
```

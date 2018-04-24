### Адаптер (для функций)

Программы на js, обычно, настраиваются с помощью модификации конфигурационных файлов. Например популярный линтер ESlint, проверяет наличие файла `.eslintrc`:

```json
{
    "parser": "esprima",
    "rules": {
        "semi": "error"
    }
}
```

ESlint парсит этот файл как `json`. С другой стороны, ESlint позволяет создавать этот файл с расширением, например `.eslint.yml`. Он, так же, подхватывается автоматически, но рассматривается как yaml. Подробнее о всех вариантах можно прочитать в [документации](https://eslint.org/docs/user-guide/configuring). Внутри ESlint есть код, который читает и парсит данный файл с конфигурацией. Вот так он мог бы выглядеть:

```javascript
import fs from 'fs';
import { parse } from 'ini';
import { safeLoad } from 'js-yaml';

const configPath = 'path/to/eslint';
const ext = path.extname(configPath);
const data = fs.readSync(configPath);

let config;
if (ext === '') {
  config = JSON.parse(data);
} else if (ext === '.yml') {
  config = safeLoad(data);
} else if (ext === '.ini') {
  config = parse(data);
}
```

Этот код можно немного улучшить воспользовавшись `switch`. Но главная проблема остается. Поддержка нового типа файла, потребует перезаписи всех мест где есть парсинг. Естественным решением в данной ситуации станет вынос логики парсинга в отдельный модуль:

```javascript
// parsers.js

import { parse } from 'ini';
import { safeLoad } from 'js-yaml';

export default (format, data) => {
  switch(format) {
    case '':
    case '.json':
      return JSON.parse(data);
    case '.yaml':
    case '.yml':
      return safeLoad(data);
    case '.ini':
      return parse(data);
    default:
      throw new Error("unkown format: ${format}");
  }
};
```

Клиентский код меняется так:

```javascript
import fs from 'fs';
import path from 'path';
import parse from './parsers';

const configPath = 'path/to/eslint';
const ext = path.extname(configPath);
const data = fs.readSync(configPath);

const config = parse(ext, data);
```

Следующим шагом можно повысить гибкость карирровав функцию парсинга:

```javascript
// parsers.js

import { parse } from 'ini';
import { safeLoad } from 'js-yaml';

export default format => (data) => {
  switch(format) {
    case '':
    case '.json':
      return JSON.parse(data);
    case '.yaml':
    case '.yml':
      return safeLoad(data);
    case '.ini':
      return parse(data);
    default:
      throw new Error("unkown format: ${format}");
  }
};
```

Клиентский код меняется так:

```javascript
import fs from 'fs';
import path from 'path';
import getParser from './parsers';

const configPath = 'path/to/eslint';
const ext = path.extname(configPath);
const data = fs.readSync(configPath);

const parse = getParser(ext);
const config = parse(data);
```

Теперь можно один раз получить парсер для конкретного типа данных и использовать его повторно без указания формата.

Внутреннюю реализацию парсинга можно сделать еще привлекательнее:

```javascript
// parsers.js

import ini from 'ini';
import { safeLoad } from 'js-yaml';

const parsers = {
  '.json': JSON.parse,
  '.yaml': safeLoad,
  '.yml': safeLoad,
  '.ini': ini.parse,
};

export default format => (data) => {
  const parse = parsers[format];
  if (!parse) {
    throw new Error("unkown format: ${format}");
  }
  return parse(data);
};
```

Теперь вместо свитча используется диспетчеризация по свойству объекта.

Дальнейшее развитие событий зависит от возникающих потребностей. Предположим что кроме парсинга, понадобилась точно такая же функциональность, но в обратную сторону. Нужно создавать или обновлять конфигурацию в разных форматах. Тогда вместо возврата функции, необходим возврат объектов с нужным набором функций:

```javascript
// parsers.js

import ini from 'ini';
import { safeLoad, safeDump } from 'js-yaml';

const yamlParser = {
  parse: safeLoad, stringify: safeDump,
};

const parsers = {
  '.json': {
    parse: JSON.parse,
    stringify: JSON.stringify,
  },
  '.yaml': yamlParser,
  '.yml': yamlParser,
  '.ini': {
    parse: ini.parse,
    stringify: ini.stringify,
  },
};

export default format => (data) => {
  const parse = parsers[format];
  if (!parse) {
    throw new Error(`unkown format: ${format}`);
  }
  return parse(data);
};
```

Если кода становится больше, то можно применить **Фасад (Модуль)** и разделить парсеры по своим собственным файлам.

На этом этапе, у некоторых программистов может возникнуть вопрос, "а почему не классы"? Можно и классы, но лучше не надо. JS гибкий язык, в котором код можно структурировать тем способом, который наиболее релевантен задаче. В кейсе описанном выше используются чистые функции и отсутствует внутреннее изменяемое состояние, которое есть в случае адаптеров для базы данных - соединение с базой.

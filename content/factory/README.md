# Factory (Фабрика)

Фабрика, в том аспекте который нас здесь интересует, предприятие производящее продукцию на основе комплектующих или сырья.

### Проблематика

_Для описания паттерна используется термин "объект-данных", под которым подразумеваются любые данные (объекты первого рода), а не только объекты как инстансы класса. Этот паттерн как и большинство других не привязан к классово-ориентированным языкам_.

Код создания объекта данных может быть довольно сложным и разнообразным, то есть в зависимости от ситуации появляются разные способы конструирования. Причем эта логика далеко не всегда касается самого объекта данных, а следовательно не может быть помещена в конструктор если это касается реализации на классах. Эту логику можно оставить как есть, без вынесения куда либо, но тогда очень легко получить дублирование кода. Дублирование само по себе допустимо, но есть черта через которую лучше не переходить.

```javascript
import fs from 'fs';
import _ from 'lodash';

// Cart принимает на вход список товаров (items),
// но они хранятся в файле в определенном формате,
// который сначала нужно прочитать и привести данные в вид подходящий для Cart
const content = fs.fileReadSync(filepath, 'utf-8');
const items = _.flatten(content.split('\n').map(item => item.split(':')));
const cart = new Cart(items);
```

Другой частый пример, когда создается не какой-то объект конкретного типа, а сам тип объекта выбирается на основе определенных параметров.

```javascript
const dbname = 'postgresql';

// Выбор базы для подключения на основе параметра хранящего имя базы как строку
let db;
if (dbname === 'postgresql') {
  db = new PostgresqlClient(/* options */);
} else if (dbname === 'mysql') {
  db = new MysqlClient(/* options */);
}
```

Аналогичная ситуация возникает и с выбором подходящей функции.

```javascript
import fs from 'fs';
import ini from 'ini';
import yaml from 'js-yaml';

const configPath = 'path/to/eslint';
const ext = path.extname(configPath);
const data = fs.readSync(configPath);

// Вибирается функция-парсер в зависимости от расширения файла
let parse;
if (format === '') {
  parse = JSON.parse;
} else if (format === '.yml') {
  parse = yaml.safeLoad;
} else if (format === '.ini') {
  parse = ini.parse;
}

parse(data);
```

### Решение

Фабрика, по своей сути, обычная абстракция с помощью функции. Все решение сводится к переносу кода в функцию.

Создание корзины:

```javascript
import fs from 'fs';
import _ from 'lodash';

const buildCart = (filepath) => {
  const content = fs.fileReadSync(filepath, 'utf-8');
  const items = _.flatten(content.split('\n').map(item => item.split(':')));
  return new Cart(items);
}
```

Выбор базы данных:

```javascript
const getDbClient = (dbname, options = {}) => {
  if (dbname === 'postgresql') {
    return new PostgresqlClient(options);
  } else if (dbname === 'mysql') {
    return new MysqlClient(options);
  }
};
```

### Влияние

+ Устраняет дублирование

### Когда использовать

* Код создания объекта-данных сложный и повторяется в разных местах
* Выбор типа объекта зависит от некоторого значения, например, строки.

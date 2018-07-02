### Адаптер (для функций)

Самый простой пример использования адаптера - функции. Предположим что в нашем проекте есть функция, которая принимает на вход код в виде строки и возвращает HTML, в котором этот же код подсвечен для удобного отображения на странице. Такой задачей занимается, например, библиотека https://highlightjs.org/.

```javascript
// highlightBlock(code)
import { highlightBlock } from 'highlightjs';

const blocks = document.querySelectorAll('pre code');
blocks.forEach(hljs.highlightBlock);
// Тоже самое но с оборачиванием в функцию (чтобы увидеть интерфейс явно)
// blocks.forEach(block => hljs.highlightBlock(block));
```

Наша функция выполняет трансляцию в HTML не самостоятельно, а использует для этого готовую функцию переданную на вход. Для этого подойдет та же библиотека `highlightjs`.

```javascript
import { highlightBlock } from 'highlightjs';
import { codeToHtml } from './convertors';

const code = /* ... */;
const html = codeToHtml(code, highlightBlock);
```

Предполагается что внутри себя `codeToHtml`, выполняет какую-то дополнительную работу, иначе можно было бы вызвать `highlightBlock` сразу.

Дальше по какой-то причине (возможно библиотека `highlightjs` нас перестала устраивать), мы решили поменять ее на другую библиотеку, назовем ее `prism`. И выяснилось сигнатура функции в `prism` не соответствует сигнатуре функции `highlightBlock`. Функция `highlight` принимает исходный код вторым параметром, а не первым.

```javascript
import highlight from 'prism';

const options = {};
const code = /* ... */;
highlight(options, code);
```

Чтобы начать использовать `highlight` в нашем коде, можно сделать две вещи. Первая, переписать содержимое `codeToHtml` так чтобы она работала с новой сигнатурой. Такой выход вполне допустим, но не всегда. Например кода может быть слишком много или мы можем быть не уверены что остановимся на новой библиотеке. Возможна ситуация в которой мы захотим попеременно использовать либо `highlightjs` либо `prism`. Во всех этих ситуациях подойдет второй выход - Адаптер. На практике, все сводится к оборачиванию исходной функции в функцию с нужной сигнатурой.

```javascript
import highlight from 'prism';
import { codeToHtml } from './convertors';

const code = /* ... */;
const newHighlight = code => highlight({}, code); // в опции передается {} как значение по-умолчанию
const html = codeToHtml(code, newHighlight);
```

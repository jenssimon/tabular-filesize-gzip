[![NPM version][npm-image]][npm-url] [![Downloads][npm-downloads-image]][npm-url] [![star this repo][gh-stars-image]][gh-url] [![fork this repo][gh-forks-image]][gh-url] [![Build Status][gh-status-image]][gh-url]

# tabular-filesize-gzip

> Show file sizes tabular including Gzip sizes.

![Screenshot](https://github.com/jenssimon/tabular-filesize-gzip/raw/master/screenshot.png)

## Install

```sh
$ yarn add tabular-filesize-gzip --dev
```

## Usage

This generates a file size table with multiple sections and groups.

```javascript
const tabularFilesizeGzip = require('tabular-filesize-gzip');

console.log(tabularFilesizeGzip([
  {
    title: 'Section 1',
    groups: [
      {
        title: 'JS files',
        files: 'test/js/**/*.js',
        ignore: [
          'test/js/legacy/**',
        ],
      },
      {
        title: 'CSS files',
        files: 'test/css/**/*.css',
      },
    ],
  },
  {
    title: 'Section 2',
    groups: [
      // ...
    ]
  }
]);
```

## License

MIT © 2022 [Jens Simon](https://github.com/jenssimon)

[npm-url]: https://www.npmjs.com/package/tabular-filesize-gzip
[npm-image]: https://badgen.net/npm/v/tabular-filesize-gzip
[npm-downloads-image]: https://badgen.net/npm/dt/tabular-filesize-gzip

[gh-url]: https://github.com/jenssimon/tabular-filesize-gzip
[gh-stars-image]: https://badgen.net/github/stars/jenssimon/tabular-filesize-gzip
[gh-forks-image]: https://badgen.net/github/forks/jenssimon/tabular-filesize-gzip
[gh-status-image]: https://badgen.net/github/status/jenssimon/tabular-filesize-gzip

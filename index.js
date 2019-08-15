const fs = require('fs');
const glob = require('glob');
const { table, getBorderCharacters } = require('table');
const gzipSize = require('gzip-size');
const filesize = require('filesize');
const chalk = require('chalk');

const emptyLine = [' ', ' ', ' '];
const headline = (title) => [title, ' ', ' '];

const tableOptions = {
  border: getBorderCharacters('void'),
  columnDefault: {
    paddingLeft: 0,
    paddingRight: 1,
  },
  drawHorizontalLine: () => false,
};

const filesizeOptions = { standard: 'iec' };

const formatSize = (size, color, padEnd = 3, padDecimal = 3) => {
  const match = /^(([0-9,]*)(.[0-9]*)?) (\S*)$/.exec(size);
  let res = size;
  if (match) {
    res = `${chalk[color](
      `${match[2]}${(match[3] || '').padEnd(padDecimal)}`.padStart(12),
    )} ${match[4].padEnd(padEnd)}`;
  }
  return res;
};

const fileSizeEntry = (f) => {
  const stats = fs.statSync(f);
  const size = stats.size.toLocaleString();
  const gzipFileSizePlain = gzipSize.sync(fs.readFileSync(f, 'UTF-8'));
  const gzipFileSize = gzipFileSizePlain.toLocaleString();
  const sizeKb = filesize(stats.size, filesizeOptions);
  const gzipFileSizeKb = filesize(gzipFileSizePlain, filesizeOptions);
  return [
    `${f}:`,
    `${formatSize(sizeKb, 'green')} (${formatSize(`${size} B`, 'green', 1, 0)})`,
    `Gzip ${formatSize(gzipFileSizeKb, 'yellow')} (${formatSize(`${gzipFileSize} B`, 'yellow', 1, 0)})`,
  ];
};

module.exports = (sections) => {
  const data = [];
  sections.forEach(({ title, groups }) => {
    data.push(headline(chalk.bold.underline.yellow(title)));
    data.push(emptyLine);
    groups.forEach(({ title: groupTitle, files, ignore }) => {
      data.push(headline(chalk.bold.underline.whiteBright(groupTitle)));
      glob.sync(files, {
        ignore: [
          ...ignore || [],
        ],
      }).forEach((f) => {
        data.push(fileSizeEntry(f));
      });
      data.push(emptyLine);
    });
  });
  return table(data, tableOptions);
};

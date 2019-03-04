const fs = require('fs');
const glob = require('glob');
const { table, getBorderCharacters } = require('table');
const gzipSize = require('gzip-size');
const chalk = require('chalk');

const emptyLine = [' ', ' ', ' '];
const headline = title => [title, ' ', ' '];

const tableOptions = {
  border: getBorderCharacters('void'),
  columnDefault: {
    paddingLeft: 0,
    paddingRight: 1,
  },
  drawHorizontalLine: () => false,
};

const getFileSizeKb = size => (size / 1024).toLocaleString(undefined, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const fileSizeEntry = (f) => {
  const stats = fs.statSync(f);
  const size = stats.size.toLocaleString();
  const gzipFileSizePlain = gzipSize.sync(fs.readFileSync(f, 'UTF-8'));
  const gzipFileSize = gzipFileSizePlain.toLocaleString();
  const sizeKb = getFileSizeKb(stats.size);
  const gzipFileSizeKb = getFileSizeKb(gzipFileSizePlain);
  return [
    `${f}:`,
    `${chalk.green(sizeKb.padStart(8))} kB (${chalk.green(size.padStart(8))} bytes)`,
    `Gzip ${chalk.yellow(gzipFileSizeKb.padStart(8))} kB (${chalk.yellow(gzipFileSize.padStart(8))} bytes)`,
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

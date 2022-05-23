import fs from 'fs';

import glob from 'glob';
import { table, getBorderCharacters } from 'table';
import { gzipSizeSync } from 'gzip-size';
import filesize from 'filesize';
import chalk from 'chalk';

import type { ChalkInstance } from 'chalk';

type LineType = [string, string, string];

interface FilesizeGroup {
  title: string;
  files: string;
  ignore?: string[];
}

interface FilesizeSection {
  title: string;
  groups: FilesizeGroup[];
}

const emptyLine: LineType = [' ', ' ', ' '];
const headline = (title: string): LineType => [title, ' ', ' '];

const tableOptions = {
  border: getBorderCharacters('void'),
  columnDefault: {
    paddingLeft: 0,
    paddingRight: 1,
  },
  drawHorizontalLine: () => false,
};

const filesizeOptions = { standard: 'iec' as ('iec' | 'jedec') };

const formatSize = (size: string, color: ChalkInstance, padEnd = 3, padDecimal = 3) => {
  const match = /^(([\d,]*)(.\d*)?) (\S*)$/.exec(size);
  let res = size;
  if (match) {
    res = `${color(

      `${match[2]}${(match[3] || '').padEnd(padDecimal)}`.padStart(12),
    )} ${match[4].padEnd(padEnd)}`;
  }
  return res;
};

const fileSizeEntry = (f: string): LineType => {
  const stats = fs.statSync(f);
  const size = stats.size.toLocaleString();
  const gzipFileSizePlain = gzipSizeSync(fs.readFileSync(f, 'utf-8'));
  const gzipFileSize = gzipFileSizePlain.toLocaleString();
  const sizeKb = filesize(stats.size, filesizeOptions);
  const gzipFileSizeKb = filesize(gzipFileSizePlain, filesizeOptions);
  return [
    `${f}:`,
    // eslint-disable-next-line sonarjs/no-nested-template-literals
    `${formatSize(sizeKb, chalk.green)} (${formatSize(`${size} B`, chalk.green, 1, 0)})`,
    // eslint-disable-next-line sonarjs/no-nested-template-literals
    `Gzip ${formatSize(gzipFileSizeKb, chalk.yellow)} (${formatSize(`${gzipFileSize} B`, chalk.yellow, 1, 0)})`,
  ];
};

const tabularFilesizeGZIP = (sections: FilesizeSection[]): string => {
  const data: LineType[] = [];
  sections.forEach(({ title, groups }) => {
    data.push(headline(chalk.bold.underline.yellow(title)));
    data.push(emptyLine);
    groups.forEach(({ title: groupTitle, files, ignore }) => {
      data.push(headline(chalk.bold.underline.whiteBright(groupTitle)));
      glob.sync(files, {
        ignore: [
          ...ignore ?? [],
        ],
      }).forEach((f) => {
        data.push(fileSizeEntry(f));
      });
      data.push(emptyLine);
    });
  });
  return table(data, tableOptions);
};

export = tabularFilesizeGZIP;

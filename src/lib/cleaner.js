import {hasNolsComment} from './util/util';

const chalk = require('chalk');

export function cleanLine(line) {
  return new Promise((resolve) => {
    if (hasNolsComment(line)) {
      resolve(getCleanedLine(line));
    } else {
      resolve(line);
    }
  });
}

function getCleanedLine(line) {
  return line.substring(0, line.indexOf('// NOLS') - 1);
}

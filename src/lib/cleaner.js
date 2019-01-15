import {hasNolsComment} from './util/util';

/*
 * Cleans (removes all NOLS_CMT's) from a line.
 * @param {string} line - The line in question.
 * @returns Promise<string>;
 */
export function cleanLine(line) {
  return new Promise((resolve) => {
    if (hasNolsComment(line)) {
      resolve(getCleanedLine(line));
    } else {
      resolve(line);
    }
  });
}

/*
 * Gives us the cleaned line.
 * @param {string} line - The line in question.
 * @returns string;
 */
function getCleanedLine(line) {
  return line.substring(0, line.indexOf('// NOLS') - 1);
}

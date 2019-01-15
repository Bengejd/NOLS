import {hasNolsComment} from './util/util';

/*
 * Reverts (removes all NOLS conversions / comments) from a line.
 * @param {string} line - The line in question.
 * @returns Promise<string>;
 */
export function revertLine(line) {
  return new Promise((resolve) => {
    hasNolsComment(line) ? resolve(getRevertedLine(line)) : resolve(line);
  });
}

/*
 * Reverts (removes all NOLS conversions / comments) from a line.
 * @param {string} line - The line in question.
 * @returns Promise<string>;
 */
function getRevertedLine(line) {
  const fileVal = line.split(':')[1].split(';')[0];
  const revertedVal = line.split(':')[2].split(';')[0];
  const newLine = line.replace(fileVal, revertedVal);
  const revertedLine = newLine.substring(0, newLine.indexOf(' /* NOLS Converted from:'));
  return new Promise((resolve) => resolve(revertedLine));
}


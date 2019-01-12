import {hasNolsComment} from './util/util';

export function revertLine(line) {
  return new Promise((resolve) => {
    if(hasNolsComment(line)) {
      resolve(getRevertedLine(line));
    } else {
      resolve(line);
    }
  });
}

function getRevertedLine(line) {
  const fileVal = line.split(':')[1].split(';')[0];
  const revertedVal = line.split(':')[2].split(';')[0];
  const newLine = line.replace(fileVal, revertedVal);
  const revertedLine = newLine.substring(0, newLine.indexOf(';') + 1);
  return new Promise((resolve) => resolve(revertedLine));
}


import {hasNolsComment} from './util/util';

export function revertLine(line) {
  return new Promise((resolve) => {
    hasNolsComment(line) ? resolve(getRevertedLine(line)) : resolve(line);
  });
}

// TODO: Improve this bit, right now it seems like it's dependent on styles being uniform across devs.
function getRevertedLine(line) {
  if (line === null) return new Promise((resolve) => resolve(line));
  const fileVal = line.split(':')[1].split(';')[0];
  const revertedVal = line.split(':')[2].split(';')[0];
  const newLine = line.replace(fileVal, revertedVal);
  const revertedLine = newLine.substring(0, newLine.indexOf(';') + 1);
  return new Promise((resolve) => resolve(revertedLine)).catch((err) => {
  });
}


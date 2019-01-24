const log = require('clg-color');

import {configQuestions} from './lib/util/questions';
import {getFiles, readFile, writeFile} from './lib/util/fileReader';
import {areWeTesting, getProductionSrc, getTestingSrc, isConvertible} from './lib/util/util';
import {convertLine} from './lib/converter';
import {revertLine} from './lib/reverter';
import {cleanLine} from './lib/cleaner';

global.NOLS_CMT = ' /* NOLS Converted from:';
global.NOLS_ARGS = require('minimist')(process.argv.slice(2));
global.VIEWPORT = {HEIGHT: 0, WIDTH: 0};
global.DEFAULT_DIR = areWeTesting() ? getTestingSrc() : getProductionSrc();

/*
 * The entry point of the package..
 */
/* istanbul ignore next */
async function init() {
  log.success('Thanks for using NOLS!');

  try {
    await configQuestions();

    const fileList = await getFiles(global.DEFAULT_DIR); // Grab all of the files in the default dir.

    fileList.map(async (filePath) => { // Loop through the files.
      const parsedFile = await readFile(filePath); // Read the file contents.
      await Promise.all(parsedFile.map(async (line) => {
        return isConvertible(line) ? await transformLine(line) : new Promise((resolve) => resolve(line));
      })).then((newFile) => writeFile(filePath, newFile)).catch((err) => console.log(err));
    });
    const len = fileList.length;
    log.success(`NOLS processed: ${len} stylesheet${len > 1 ? 's' : ''} in an arbitrarily short amount of time`);
    log.warning(`Do not close terminal until NOLS has exited gracefully`);
  } catch (err) {
    log.error(err);
  }
}

/*
 * Determines what we should do with a line & calls the respective function on it..
 * @param {string} line - The line in question.
 * @returns Promise<string>;
 */
/* istanbul ignore next */
function transformLine(line) {
  return new Promise(async (resolve) => {
    switch (global.MODE) {
      case('Default'):
        return resolve(await convertLine(line));
      case('Revert'):
        return resolve(await revertLine(line));
      case('Clean'):
        return resolve(await cleanLine(line));
    }
  });
}

init();


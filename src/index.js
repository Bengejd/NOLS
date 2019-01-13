const chalk = require('chalk');

import {configQuestions} from './lib/util/questions';
import {getFiles, readFile, writeFile} from './lib/util/fileReader';
import {isConvertible, setOptions} from './lib/util/util';
import {convertLine} from './lib/converter';
import {revertLine} from './lib/reverter';
import {cleanLine} from './lib/cleaner';

const DEFAULT_DIR = './test/test-scss/read-file-tests/only-stylesheets/';
global.NOLS_CMT = ' // NOLS Converted from:';

/* istanbul ignore next */
async function init() {
  console.log(chalk.green('Thanks for using NOLS!'));
  setOptions(await configQuestions());

  const fileList = await getFiles(DEFAULT_DIR); // Grab all of the files in the default dir.

  fileList.map(async (filePath) => { // Loop through the files.
    const parsedFile = await readFile(filePath); // Read the file contents.
    await Promise.all(parsedFile.map(async (line) => {
      return isConvertible(line) ? await transformLine(line) : new Promise((resolve) => resolve(line));
    })).then((newFile) => writeFile(filePath, newFile)).catch((err) => console.log(err));
  });
}

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

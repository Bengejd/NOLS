const chalk = require('chalk');
const performance = require('perf_hooks').performance;

import {configQuestions} from './lib/util/questions';
import {getFiles, readFile, writeFile} from './lib/util/fileReader';
import {isConvertible} from './lib/util/util';
import {convertLine} from './lib/converter';
import {revertLine} from './lib/reverter';
import {cleanLine} from './lib/cleaner';

const DEFAULT_DIR = './src/components/user-item/';
global.NOLS_CMT = ' // NOLS Converted from:';

/* istanbul ignore next */
async function init() {
  console.log(chalk.green('Thanks for using NOLS!'));
  setOptions(await configQuestions());
  const perfStart = performance.now(); // Just for performance checking purposes.
  const fileList = await getFiles(DEFAULT_DIR); // Grab all of the files in the default dir.
  fileList.map(async (filePath) => { // Loop through the files.
    console.log(chalk.yellow('Processing: ', filePath));
    const parsedFile = await readFile(filePath); // Read the file contents.
    await Promise.all(parsedFile.map(async (line) => { // Loop through the file contents, wait for the file to finish.
      if (isConvertible(line)) { // If the line be converted.
        return await transformLine(line); // transform the line (based on what mode we're running in).
      } else {
        return new Promise((resolve) => resolve(line)); // else return the line as is.
      }
    })) // After the file has processed & been converted, write the new file contents to it.
      .then((newFile) => writeFile(filePath, newFile));
  });
  console.log(chalk.green(`NOLS took ${performance.now() - perfStart} to process ${fileList.length} files`));
}

/* istanbul ignore next */
function transformLine(line) {
  return new Promise(async (resolve) => {
    switch (global.MODE) {
      case('Default'): { // Convert the stylesheet line.
        resolve(await convertLine(line));
        break;
      }
      case('Revert'): { // Revert the stylesheet line.
        resolve(await revertLine(line));
        break;
      }
      case('Clean'): { // Clean the stylesheet line.
        resolve(await cleanLine(line));
        break;
      }
    }
  });
}

/* istanbul ignore next */
function setOptions(opts) {
  global.MODE = opts.MODE;
  global.VIEWPORT = {
    HEIGHT: parseFloat(opts.HEIGHT),
    WIDTH: parseFloat(opts.WIDTH),
  };
}

init();

import {configQuestions} from './lib/util/questions';
import {getFiles, readFile, writeFile} from './lib/util/fileReader';
import {isConvertible} from './lib/util/util';
import {convertLine} from './lib/converter';
import {revertLine} from './lib/reverter';
import {cleanLine} from './lib/cleaner';

const chalk = require('chalk');

const DEFAULT_DIR = './src/';
global.NOLS_CMT = ' // NOLS Converted from:';


async function init() {
  console.log(chalk.green('Thanks for using NOLS!'));
  setOptions(await configQuestions());

  const fileList = await getFiles(DEFAULT_DIR);

  fileList.map(async (filePath) => {
    const parsedFile = await readFile(filePath);
    await Promise.all(parsedFile.map(async (line) => {
      if(isConvertible(line)) {
        return await transformLine(line);
      } else {
        return line;
      }
    }))
      .then((newFile) => writeFile(filePath, newFile));
  });
}

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

function setOptions(opts) {
  global.MODE = opts.MODE;
  global.VIEWPORT = {
    HEIGHT: parseFloat(opts.HEIGHT),
    WIDTH: parseFloat(opts.WIDTH),
  };
}

init();

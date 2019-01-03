// #!/usr/bin/env node

const inquirer = require('inquirer');
const fs = require('fs');
const chalk = require('chalk');
const figlet = require('figlet');
const lineReader = require('line-reader');

import {
  calculateVH,
  calculateVW,
  getTranslationType,
  getViewportType,
  hasConfigFile,
  hasPX,
  isComment,
  isDirectory,
  isNewLine,
  verifyConfig,
} from './util/index';

const config_data = require('../rsoconfig');

// Grab the CLI arguments.
//   console.log(JSON.stringify(process.argv));

// DEFAULT VALUES
var HEIGHT = 812;
var WIDTH = 375;
var DEFAULT_DIR = './src/';

var REVERT = false;
var CLEAN = false;

const RSO_CMT = ' // RSO Converted from:';

const init = async () => {
  console.time('RSO');
  // Show the logo
  showLogo();

  // Grab all config values (from input or file).
  determineArgs().then(() => start());
};

// Show the entry logo and name of the library.

const showLogo = () => {
  console.log(chalk.green('Responsive SCSS Optimizer - better known as\n'));
  console.log(
    chalk.green(
      figlet.textSync('RSO', {
        font: 'colossal',
        horizontalLayout: 'default',
        verticalLayout: 'default'
      })
    )
  );
};

/* istanbul ignore next */
const determineArgs = async (badArgs) => {
  return new Promise(async (resolve) => {
    console.log('Checking for config.json file...');
    if (hasConfigFile() === false || badArgs === true) { // Couldn't find rsoconfig.json
      if (badArgs === false) console.log(chalk.yellow('Config file not found...'));

      const answers = await askQuestions();
      HEIGHT = parseFloat(answers.HEIGHT);
      WIDTH = parseFloat(answers.WIDTH);

      if (answers.SAVE === 'YES') { // Save the configuration to the config.json
        fs.writeFileSync('./rsoconfig.json', JSON.stringify({height: HEIGHT, width: WIDTH}), () => {
          console.log(chalk.green('Created rsoconfig.json'));
          console.log(chalk.green('Setup complete. Beginning RSO'));
        });
      }
      resolve();
    }
    else { // Found the configuration.
      HEIGHT = parseFloat(config_data.height);
      WIDTH = parseFloat(config_data.width);

      if (verifyConfig(HEIGHT, WIDTH)) {
        console.log('Config is setup correctly');
        resolve();
      } else {
        console.log(chalk.red('Something isn\'t right with rsoconfig.json...let\'s fix that!'));
        determineArgs(true);
      }
    }
  });
};

/* istanbul ignore next */
const askQuestions = () => {
  const questions = [
    {
      name: 'HEIGHT',
      type: 'input',
      message: 'What is the viewport HEIGHT of the device you\'ve been developing in?'
    },
    {
      name: 'WIDTH',
      type: 'input',
      message: 'What is the viewport WIDTH of the device you\'ve been developing in?'
    },
    {
      name: 'SAVE',
      type: 'list',
      message: 'Use these values in the future?',
      choices: ['YES', 'NO'],
    }
  ];
  return inquirer.prompt(questions);
};

const start = async () => {
  // Grab all files in the .src/ folder.
  const files = await getFiles(DEFAULT_DIR);
  console.log(chalk.green(`${files.length} scss files found`));

  files.forEach(async (file) => {

    // Read that file line by line
    const newFile = await readAndTranslateFile(file);

    // Write conversion back to file.
    await writeFile(file, await newFile);
  });
};

const writeFile = (file, newFile) => {
  fs.writeFile(file, '', () => {
  });
  newFile.map(line => {
    fs.appendFileSync(file, line + '\n');
  });
  console.log(chalk.green('Finished', file));
};

/* istanbul ignore next */
const getFiles = (dir, fileList) => {
  let files = fs.readdirSync(dir);
  fileList = fileList || [];
  files.forEach(async (file) => {
    if (isDirectory(dir + file)) {
      fileList = await getFiles(dir + file + '/', fileList);
    } else {
      fileList.push(dir + file);
    }
  });
  fileList = fileList.filter((file) => {
    const upper = file.toUpperCase();
    return (upper.indexOf('.SCSS') > -1 || upper.indexOf('.CSS') > -1);
  });
  return new Promise((resolve) => resolve(fileList));
};

/* istanbul ignore next */
export const readAndTranslateFile = (file) => {
  console.log(file);
  let newFileScss = [];
  return new Promise((resolve) => {
    lineReader.eachLine(file, async (line, last) => {
      if ((isComment(line) || isNewLine(line)) && !last) { // Don't change comments.
        newFileScss.push(line);
      }
      else if (last) { // Last line of the file (should be space in theory, but also could be just a close bracket...))
        newFileScss.push(line);
        resolve(newFileScss);
        return false; // stop reading
      }
      else {
        const translationType = await getTranslationType(line);
        if (translationType !== null) {
          const newLine = await doTranslation(line, translationType);
          newFileScss.push(await newLine);
        } else {
          newFileScss.push(line);
        }
      }
    });
  });
};

export const doTranslation = (line, type) => {
  const originalValue = line.split(':')[1]; // Grab the value.
  const parsedVal = parseFloat(originalValue); // Convert value to float (which removes the px/vh/%/em... strings).
  return new Promise(async (resolve, reject) => {
    if (!hasPX(line.split(':')[1])) resolve(line); // Not a PX value, so we'll skip it for now.

    /* istanbul ignore next */
    new Promise((resolve) => {
      switch (type) {
        case('X'): {
          resolve(calculateVW(parsedVal, WIDTH), 'vw');
          break;
        }
        case('Y'): {
          resolve(calculateVH(parsedVal, HEIGHT), 'vh');
          break;
        }
        case('XY'): {
          console.log(chalk.warning(line.split(':')[0], 'attribute not currently supported', line));
          reject(line);
          break;
        }
        default: {
          console.log(chalk.warning('Unknown type slipped through the cracks...', type));
          reject(line);
          break;
        }
      }
    }).then((convertedVal) => {
      if (convertedVal !== null) {
        resolve(line.replace(`${parsedVal}px`, `${convertedVal}${getViewportType(type)}`) + RSO_CMT + originalValue);
      }
      else { // Just one last check before writing. We shouldn't ever get here in theory.
        resolve(line);
      }
    }).catch(line => { // Line was rejected for some reason, so we'll skip it.
      resolve(line);
    });
  })
};

init();

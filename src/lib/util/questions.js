const log = require('clg-color');
const inquirer = require('inquirer');

import {areWeTesting, getTestingSrc, hasEntryArg, hasHeightArg, hasWidthArg, isMochaRunning} from './util';

/**
 * Asks the user some config questions.
 * @returns Promise<Object>;
 */
export async function configQuestions() {
  /* istanbul ignore next */
  const questions = [
    {
      name: 'MODE',
      message: 'What would you like to do?',
      type: 'list',
      choices: ['Default', 'Revert', 'Clean']
    },
    {
      name: 'ENTRY',
      message: `The default entry folder for NOLS is ${global.DEFAULT_DIR}, is that what you'd like to target?`,
      type: 'list',
      choices: ['YES', 'NO'],
      when() {
        return !hasEntryArg();
      }
    },
    {
      name: 'DEFAULT_DIR',
      message: 'What folder would you like NOLS to run in?',
      type: 'input',
      when(ANS) {
        return (ANS.ENTRY === 'NO');
      }
    },
    {
      name: 'HEIGHT',
      message: 'What is the device HEIGHT that you\'re targeting?',
      type: 'input',
      when(ANS) {
        return (ANS.MODE === 'Default' && (!areWeTesting() || !hasHeightArg())
        );
      }
    },
    {
      name: 'WIDTH',
      type: 'input',
      message: 'What is the device WIDTH that you\'re targeting?',
      when(ANS) {
        return (ANS.MODE === 'Default' && (!areWeTesting() || !hasWidthArg())
        );
      }
    },
    {
      name: 'CONFIRM',
      type: 'list',
      message: 'Are you sure you want to proceed with this configuration?',
      when(ANS) {
        if(ANS.MODE === 'Default') {
          log.info(`
        MODE: ${ANS.MODE}
        HEIGHT: ${parseFloat(ANS.HEIGHT || global.NOLS_ARGS.height || global.NOLS_ARGS.h)}px
        WIDTH: ${parseFloat(ANS.WIDTH || global.NOLS_ARGS.width || global.NOLS_ARGS.w)}px
        ENTRY FOLDER: ${ANS.DEFAULT_DIR || global.DEFAULT_DIR}
        `);
        } else {
          log.info(`
        MODE: ${ANS.MODE}
        ENTRY FOLDER: ${ANS.DEFAULT_DIR || global.DEFAULT_DIR}
        `);
        }
        return true;
      },
      choices: ['YES', 'NO'],
    },
  ];

  const answers = isMochaRunning() ?
    await mochaMockConfigQuestionsResponse() : /* istanbul ignore next */ await inquirer.prompt(questions);
  return setOptions(answers);
}

export function mochaMockConfigQuestionsResponse() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        WIDTH: 375,
        HEIGHT: 812,
        DEFAULT_DIR: getTestingSrc(),
        MODE: 'Default',
        CONFIRM: 'YES',
      });
    }, 25);
  });
}

/**
 * Sets the package config options.
 * @param {object} opts - The question answers that we receive.
 * @returns Promise;
 */

export function setOptions(opts) {
  /* istanbul ignore next */
  return new Promise((resolve, reject) => {
    if(areWeTesting()) resolve(opts);

    global.MODE = opts.MODE;

    if (opts.DEFAULT_DIR) setEntry(opts.DEFAULT_DIR.trim());

    if (opts.HEIGHT) global.VIEWPORT.HEIGHT = parseFloat(opts.HEIGHT);
    else global.VIEWPORT.HEIGHT = global.NOLS_ARGS.h || global.NOLS_ARGS.height;

    if (opts.WIDTH) global.VIEWPORT.WIDTH = parseFloat(opts.WIDTH);
    else global.VIEWPORT.WIDTH = global.NOLS_ARGS.width || global.NOLS_ARGS.w;

    if (opts.CONFIRM === 'YES') resolve(opts);
    else reject('NOLS Aborted: Try fixing your NOLS arguments before running again.');
  });
}

/**
 * sets the package entry directory.
 * @param {string} dir - The question entry directory that we receive.
 * @returns string;
 */

export function setEntry(dir) {
  let fixedDir = dir;

  if(fixedDir.substring(0, 2) !== './') {
    if(fixedDir.startsWith('.')) fixedDir = './' + fixedDir.substring(1, fixedDir.length);
    else if(dir.startsWith('/')) fixedDir = '.' + fixedDir;
    else fixedDir = './' + fixedDir;
  }
  if(!fixedDir.endsWith('/')) fixedDir = fixedDir + '/';

  return global.DEFAULT_DIR = fixedDir;
}

const lineReader = require('line-reader');
const fs = require('fs');
const chalk = require('chalk');

/**
 * Reads a files contents.
 * @param {string} filePath - The filePath of the file we are reading.
 * @returns Promise<[]>;
 */
export function readFile(filePath) {
  const parsedFile = [];
  var isReading = false; // lineReader doesn't handle empty files well.
  return new Promise((resolve) => {
    lineReader.eachLine(filePath, (line, last) => {
      if (!isReading) isReading = true;
      parsedFile.push(line);
      if (last) {
        resolve(parsedFile);
      }
    });
    if (!isReading) setTimeout(() => resolve([]), 25); // If the file isn't reading, resolve an empty array.
  });
}

/**
 * Writes to a filePath with the specified contents.
 * @param {string} filePath - The filePath of the file we are writing to.
 * @param {string[]} newFile - The newFile contents.
 */

/* istanbul ignore next */
export function writeFile(filePath, newFile) {
  fs.writeFile(filePath, '', () => {
  });
  newFile.map((line, index, arr) => {
    fs.appendFileSync(filePath, line + '\n');
    if (arr.length - 1 === index) console.log(chalk.green('Finished', filePath));
  });
}

/**
 * Recursively grabs all files from the entry directory.
 * @param {string} dir - the current directory that nols is working in.
 * @param {string[] || []} fileList - Initially empty. Populated and passed on subsequent calls.
 * @returns Promise<[]>;
 */
export function getFiles(dir, fileList) {
  const files = fs.readdirSync(dir);
  fileList = fileList || [];
  files.map(async (filePath) => {
    if (isDirectory(dir + filePath)) {
      fileList = await getFiles(dir + filePath + '/', fileList);
    } else {
      fileList.push(dir + filePath);
    }
  });
  fileList = fileList.filter((filePath) => isStylesheet(filePath.toLowerCase()));
  return new Promise((resolve) => resolve(fileList));
}

/**
 * Writes to a filePath with the specified contents.
 * @param {string} filePath - The filePath of the file we are writing to.
 * @returns Boolean;
 */
function isStylesheet(filePath) {
  return (filePath.endsWith('.scss') || filePath.endsWith('.css'));
}

/**
 * Checks if a path is a directory or not.
 * @param {string} path - The path that is being checked.
 * @returns Boolean;
 */
function isDirectory(path) {
  try {
    return fs.statSync(path).isDirectory();
  } catch (err) {
    return false;
  }
}

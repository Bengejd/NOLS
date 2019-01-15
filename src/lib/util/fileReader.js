const lineReader = require('line-reader');
const fs = require('fs');
const log = require('clg-color');

/**
 * Reads a files contents.
 * @param {string} filePath - The filePath of the file we are reading.
 * @returns Promise<[]>;
 */
export function readFile(filePath) {
  const parsedFile = [];
  return new Promise(async (resolve) => {

    lineReader.eachLine(filePath, (line, last) => {
      parsedFile.push(line);
      if (last) {
        return false;
      }
    }, (err) => {
      /* istanbul ignore next */
      if (err) { // Shouldn't ever get here, but just in case.
        log.error('NOLS encountered an error reading file: ', filePath, err);
        resolve();
      }
      resolve(parsedFile);
    });
  }).catch(/* istanbul ignore next */ (err) => {
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
    newFile.map((line) => {
      fs.appendFileSync(filePath, line + '\n');
    });
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
 * Tells us if a file is a stylesheet file.
 * @param {string} filePath - The filePath of the file we are checking.
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

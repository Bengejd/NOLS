const lineReader = require('line-reader');
const fs = require('fs');
const chalk = require('chalk');

export function readFile(filePath) {
  console.log('Reading file: ', filePath);
  const parsedFile = [];
  return new Promise((resolve) => {
    lineReader.eachLine(filePath, (line, last) => {
      parsedFile.push(line);
      if(last) {
        resolve(parsedFile);
      }
    });
  });
}

export function writeFile(filePath, newFile) {
  fs.writeFile(filePath, '', () => {});
  newFile.map((line) => {
    fs.appendFileSync(filePath, line + '\n');
  });
  console.log(chalk.green('Finished', filePath));
}

export function getFiles(dir, fileList) {
  const files = fs.readdirSync(dir);
  fileList = fileList || [];
  files.map(async (file) => {
    if (isDirectory(dir + file)) {
      fileList = await getFiles(dir + file + '/', fileList);
    } else {
      fileList.push(dir + file);
    }
  });
  fileList = fileList.filter((file) => isStylesheet(file.toLowerCase()));
  return new Promise((resolve) => resolve(fileList));
}

function isStylesheet(file) {
  return (file.indexOf('.scss') > -1 || file.indexOf('.css') > -1);
}

function isDirectory(path) {
  try {
    return fs.statSync(path).isDirectory();
  } catch (err) {
    return false;
  }
}

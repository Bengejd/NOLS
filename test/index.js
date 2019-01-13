import assert from 'assert';
import {getFiles, readFile} from '../src/lib/util/fileReader';

const readFileTests = [
  {
    input: './test/test-scss/read-file-tests/only-stylesheets/first.scss',
    expectedResult: ['.foo {', '  height: 812px;', '  width: 375px;', '  padding-left: 20px;', '  padding-right: 20px;',
      '  margin-bottom: 50px;', '}', '', '.bar {', '  height: 200px;', '  width: 267px;', '  margin-top: 90px;', '}',
      '', '.baz {', '  height: 406px;', '  width: 100px;', '  transform: translateX(20px);', '}', '', ''],
    description: 'should return an array of the file contents.'
  },
  {
    input: './test/test-scss/read-file-tests/only-stylesheets/second.scss',
    expectedResult: ['.foo {', '  height: 812px;', '  //width: 375px;', '', '}', '', '.bar {', '  height: 200px;',
      '  width: 267px;', '  margin-top: 90px;', '  /*', '   * THIS IS A BLOCK COMMENT.', '   */', '}'],
    description: 'should return an array of the file contents.'
  },
  {
    input: './test/test-scss/read-file-tests/only-stylesheets/third.scss',
    expectedResult: [],
    description: 'should return an empty array if the file is empty.'
  }
];

describe('ReadFile(): ', () => {
  readFileTests.forEach((sample) => {
    it(sample.description, async () => {
      const fileContents = await readFile(sample.input);
      assert.deepEqual(fileContents, sample.expectedResult);
    });
  });
});

const getFilesTests = [
  {
    input: './test/test-scss/read-file-tests/only-stylesheets/',
    expectedResult: [
      './test/test-scss/read-file-tests/only-stylesheets/first.scss',
      './test/test-scss/read-file-tests/only-stylesheets/second.scss',
      './test/test-scss/read-file-tests/only-stylesheets/third.scss'
    ],
    description: 'should return an array of stylesheet file paths: first.scss, second.scss, third.scss'
  },
  {
    input: './test/test-scss/read-file-tests/empty-folder/',
    expectedResult: [],
    description: 'should return an empty array if there are files in the folder'
  },
  {
    input: './test/test-scss/read-file-tests/mixed-files/',
    expectedResult: [
      './test/test-scss/read-file-tests/mixed-files/fifth.css',
      './test/test-scss/read-file-tests/mixed-files/fourth.scss'
    ],
    description: 'should return an array of only stylesheets when there are multiple file types.'
  },
  {
    input: './test/test-scss/read-file-tests/no-stylesheets/',
    expectedResult: [],
    description: 'should return an empty array when no stylesheets are present.'
  },
  {
    input: './test/test-scss/read-file-tests/folder-with-.scss-in-name/',
    expectedResult: [],
    description: 'should return an empty array even if the folder name has scss in it',
  },
  {
    input: './test/test-scss/read-file-tests/folder-with-.scss-in-name/.scss',
    expectedResult: [],
    description: 'should return an empty array even if the folder name ends with .scss',
  }
];

describe('GetFiles(): ', () => {
  getFilesTests.forEach((sample) => {
    it(sample.description, async () => {
      const filePaths = await getFiles(sample.input);
      assert.deepEqual(filePaths, sample.expectedResult);
    });
  });
});


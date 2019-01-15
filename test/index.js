import assert from 'assert';
import {getFiles, readFile} from '../src/lib/util/fileReader';
import {revertLine} from '../src/lib/reverter';
import {convertLine} from '../src/lib/converter';

describe('ReadFile(): ', () => {
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
  readFileTests.forEach((sample) => {
    it(sample.description, async () => {
      const fileContents = await readFile(sample.input);
      assert.deepEqual(fileContents, sample.expectedResult);
    });
  });
});

describe('GetFiles(): ', () => {
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
      description: 'should return an empty array if there are no files in the folder'
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
  getFilesTests.forEach((sample) => {
    it(sample.description, async () => {
      const filePaths = await getFiles(sample.input);
      assert.deepEqual(filePaths, sample.expectedResult);
    });
  });
});

describe('RevertLine(): ', () => {
  const revertLineTests = [
    {
      input: '  height: 100vh; /* NOLS Converted from: 812px; */',
      expectedResult: '  height: 812px;',
      description: 'should return the original string in px, without the comment, when a line has a NOLS comment'
    },
    {
      input: '  padding-left: 5.333333333333333vw; /* NOLS Converted from: 20px; */',
      expectedResult: '  padding-left: 20px;',
      description: 'should return the original string in px, without the comment, when a line has a NOLS comment'
    },
    {
      input: '  margin-bottom: 6.157635467980295vh; /* NOLS Converted from: 50px; */',
      expectedResult: '  margin-bottom: 50px;',
      description: 'should return the original string in px, without the comment, when a line has a NOLS comment',
    },
    {
      input: ' ',
      expectedResult: ' ',
      description: 'should return the empty string when receiving an empty string',
    },
    {
      input: '  margin-bottom: 6.157635467980295vh; /* from: 50px; */',
      expectedResult: '  margin-bottom: 6.157635467980295vh; /* from: 50px; */',
      description: 'should return the string when receiving a line that doesn\'t contain a complete NOLS comment ',
    },
  ];
  revertLineTests.forEach((sample) => {
    it(sample.description, async () => {
      const revertedLine = await revertLine(sample.input);
      assert.deepEqual(revertedLine, sample.expectedResult);
    });
  });
});

describe('ConvertLine()', () => {
  const convertLineTests = [
    {
      input: '  height: 812px;',
      expectedResult: '  height: 100vh; /* NOLS Converted from: 812px; */',
      description: 'should return "height: 100vh; /* NOLS Converted from: 812px;" when receiving "height: 812px;"'
    },
    {
      input: '  padding-left: 20px;',
      expectedResult: '  padding-left: 5.333333333333333vw; /* NOLS Converted from: 20px; */',
      description: 'should return "padding-left: 5.333333333333333vw; /* NOLS Converted from: 20px;" when receiving' +
        ' "padding-left:20px"'
    },
    {
      input: '  margin-bottom: 50px;',
      expectedResult: '  margin-bottom: 6.157635467980295vh; /* NOLS Converted from: 50px; */',
      description: 'should return "margin-bottom: 6.157635467980295vh; /* NOLS Converted from: 50px;" when receiving' +
        ' "margin-bottom: 50px;"'
    },
  ];
  convertLineTests.forEach((sample) => {
    it(sample.description, async () => {
      const convertedLine = await convertLine(sample.input);
      assert.equal(convertedLine, sample.expectedResult);
    });
  });
});

describe('areWeTesting()', () => {
  const areWeTestingTests = [
    {
      input: null,
      expectedResult: null,
      description: 'Just a placeholder for areWeTesting()'
    }
  ];
  areWeTestingTests.forEach((sample) => {
    it(sample.description, async () => {
     assert.equal(sample.input, sample.expectedResult);
    });
  });
});

// describe('GetRevertedLine()', () => {
//   const temp = [];
//   temp.forEach((sample) => {
//     it(sample.description, async () => {
//       const revertedLine = [];
//       assert.deepEqual(revertedLine, sample.expectedResult);
//     });
//   });
// });

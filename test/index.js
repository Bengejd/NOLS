import assert from 'assert';
import {getFiles, readFile} from '../src/lib/util/fileReader';
import {revertLine} from '../src/lib/reverter';
import {cleanLine} from '../src/lib/cleaner';
import {calculateVH, calculateVW, convertLine, getViewportType} from '../src/lib/converter';
import {
  getTestingSrc,
  hasBorderRadius,
  hasFontSize,
  hasNolsComment,
  hasPX,
  isABracket,
  isAMixin,
  isConvertible,
  isExtended,
  isNewLine,
  isOnlyComment,
  isString,
  onlyBlockComment,
  onlyInlineComment,
  removeBlockComments,
} from '../src/lib/util/util';
import {configQuestions, setEntry} from '../src/lib/util/questions';

describe('readFile(): ', () => {
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

describe('getFiles(): ', () => {
  const getFilesTests = [
    {
      input: './test/test-scss/read-file-tests/only-stylesheets/',
      expectedResult: [
        './test/test-scss/read-file-tests/only-stylesheets/first.scss',
        './test/test-scss/read-file-tests/only-stylesheets/fourth.scss',
        './test/test-scss/read-file-tests/only-stylesheets/second.scss',
        './test/test-scss/read-file-tests/only-stylesheets/third.scss',
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

describe('revertLine(): ', () => {
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
    {
      input: '  height: 100vh; } /* NOLS Converted from: 812px; */',
      expectedResult: '  height: 812px; }',
      description: 'should return the original string in px, when receiving "height: 100vh; } /* NOLS Converted from: 812px; */"'
    },
    {
      input: '{ height: 100vh; } /* NOLS Converted from: 812px; */',
      expectedResult: '{ height: 812px; }',
      description: 'should return the original string in px when receiving "{ height: 100vh; } /* NOLS Converted from: 812px; */"'
    },
  ];
  revertLineTests.forEach((sample) => {
    it(sample.description, async () => {
      const revertedLine = await revertLine(sample.input);
      assert.deepEqual(revertedLine, sample.expectedResult);
    });
  });
});

describe('convertLine()', () => {
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
    {
      input: '  margin: 50px;',
      expectedResult: '  margin: 50px;',
      description: 'should return "margin: 50px;" when receiving "margin: 50px;"'
    },
    {
      input: '  asdf: 50px;',
      expectedResult: '  asdf: 50px;',
      description: 'should return "asdf: 50px;" when receiving "asdf: 50px;"'
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

describe('isConvertible()', () => {
  const isConvertibleTests = [
    {
      input: '\n',
      expectedResult: false,
      description: 'should return false when receiving a new line',
    },
    {
      input: '// inline comment',
      expectedResult: false,
      description: 'should return false when receiving only an inline comment',
    },
    {
      input: '/* block comment */',
      expectedResult: false,
      description: 'should return false when receiving only a block comment',
    },
    {
      input: '@include testing(50px, 30px)',
      expectedResult: false,
      description: 'should return false when receiving a mixin',
    },
    {
      input: '@extend testing',
      expectedResult: false,
      description: 'should return false when receiving an extend',
    },
    {
      input: 'font-size:30px',
      expectedResult: false,
      description: 'should return false when receiving a font-size',
    },
    {
      input: 'border-top-right-radius: 30px',
      expectedResult: false,
      description: 'should return false when receiving a border-top-right-radius',
    },
    {
      input: 'border-top-left-radius: 30px',
      expectedResult: false,
      description: 'should return false when receiving a border-top-left-radius',
    },
    {
      input: 'border-bottom-left-radius: 30px',
      expectedResult: false,
      description: 'should return false when receiving a border-bottom-left-radius',
    },
    {
      input: 'border-top-right-radius: 30px',
      expectedResult: false,
      description: 'should return false when receiving a border-top-right-radius',
    },
    {
      input: 'width: 30px',
      expectedResult: true,
      description: 'should return true when receiving a line with a px value.',
    },
    {
      input: 'height: 30vh /* NOLS C /*',
      expectedResult: false,
      description: 'should return false when receiving a line without a px value'
    },
    {
      input: 'height: 30px // testing',
      expectedResult: true,
      description: 'should return true when receiving a line with a px value & ending with an inline comment',
    },
    {
      input: '//height: 30px // testing',
      expectedResult: false,
      description: 'should return false when receiving a line starting with an inline comment px value',
    },
    {
      input: '/* Block comment */ height: 30px // testing',
      expectedResult: true,
      description: 'should return true when receiving a line starting with a block comment, containing a px value,' +
        ' and ending with an inline comment.',
    },
    {
      input: 'heite: 30px',
      expectedResult: true,
      description: 'should return true when receiving a line with a misspelling in it, with a pixel value',
    },
    {
      input: '/* block comment */ height: 30px; /* block comment */',
      expectedResult: true,
      description: 'should return true when receiving "/* block comment */ height: 30px; /* block comment */"'
    }
  ];
  isConvertibleTests.forEach((sample) => {
    it(sample.description, async () => {

      assert.equal(isConvertible(sample.input), sample.expectedResult);
    });
  });
});

describe('hasBorderRadius()', () => {
  const hasBorderRadiusTests = [
    {
      input: 'border-top-left-radius: 50px',
      expectedResult: true,
      description: 'should return true when receiving a line with "border-top-left-radius"',
    },
    {
      input: 'border-top-right-radius: 50px',
      expectedResult: true,
      description: 'should return true when receiving a line with "border-top-left-radius"',
    },
    {
      input: 'border-bottom-left-radius: 50px',
      expectedResult: true,
      description: 'should return true when receiving a line with "border-bottom-left-radius"',
    },
    {
      input: 'border-bottom-right-radius: 50px',
      expectedResult: true,
      description: 'should return true when receiving a line with "border-bottom-right-radius"',
    },
    {
      input: 'height: 30px',
      expectedResult: false,
      description: 'should return false when receiving anything else',
    },
  ];
  hasBorderRadiusTests.forEach((sample) => {
    it(sample.description, () => {
      assert.equal(hasBorderRadius(sample.input), sample.expectedResult);
    });
  });
});

describe('hasFontSize()', () => {
  const hasFontSizeTests = [
    {
      input: 'font-size: 30px',
      expectedResult: true,
      description: 'should return true when receiving a line with "font-size: 30px"',
    },
    {
      input: 'height: 30px',
      expectedResult: false,
      description: 'should return true when receiving anything else',
    },
  ];
  hasFontSizeTests.forEach((sample) => {
    it(sample.description, async () => {
      assert.equal(hasFontSize(sample.input), sample.expectedResult);
    });
  });
});

describe('isAMixin()', () => {
  const isAMixinTests = [
    {
      input: '@include testing(50px, 50px)',
      expectedResult: true,
      description: 'should return true when receiving a mixin - "@include testing(50px, 50px)',
    },
    {
      input: 'height: 30px',
      expectedResult: false,
      description: 'should return false when receiving anything else',
    },
  ];
  isAMixinTests.forEach((sample) => {
    it(sample.description, async () => {
      assert.equal(isAMixin(sample.input), sample.expectedResult);
    });
  });
});

describe('isExtended()', () => {
  const isExtendedTests = [
    {
      input: '@extend .test;',
      expectedResult: true,
      description: 'should return true when receiving "@extend .test"',
    },
    {
      input: 'height: 30px;',
      expectedResult: false,
      description: 'should return false when receiving anything else',
    },
  ];
  isExtendedTests.forEach((sample) => {
    it(sample.description, async () => {
      assert.equal(isExtended(sample.input), sample.expectedResult);
    });
  });
});

describe('notABracket()', () => {
  const isABracketTests = [
    {
      input: '{',
      expectedResult: true,
      description: 'should return true when receiving only an opening bracket',
    },
    {
      input: '}',
      expectedResult: true,
      description: 'should return true when receiving only a closing bracket',
    },
    {
      input: '{ height: 30px; }',
      expectedResult: false,
      description: 'should return false when receiving "{ height: 30px; }"',
    },
    {
      input: '{ height: 30px;',
      expectedResult: false,
      description: 'should return false when receiving "{ height: 30px;"',
    },
    {
      input: 'height: 30px; }',
      expectedResult: false,
      description: 'should return false when receiving "height: 30px; }"',
    },
  ];
  isABracketTests.forEach((sample) => {
    it(sample.description, async () => {
      assert.equal(isABracket(sample.input), sample.expectedResult);
    });
  });
});

describe('isOnlyComment()', () => {
  const isOnlyCommentTests = [
    {
      input: '// inline comment',
      expectedResult: true,
      description: 'should return true when recieving "// inline comment"',
    },
    {
      input: 'height: 30px; // test inline-comment',
      expectedResult: false,
      description: 'should return false when receiving "height: 30px; // test inline-comment"',
    },
    {
      input: '/* block comment */',
      expectedResult: true,
      description: 'should return true when receiving "/* block comment */"',
    },
    {
      input: 'height: 30px /* block comment */',
      expectedResult: false,
      description: 'should return false when receiving "height: 30px /* block comment */"',
    },
    {
      input: 'height: 30px;',
      expectedResult: false,
      description: 'should return false when receiving "height: 30px;"',
    },
  ];
  isOnlyCommentTests.forEach((sample) => {
    it(sample.description, async () => {
      assert.equal(isOnlyComment(sample.input), sample.expectedResult);
    });
  });
});

describe('onlyInlineComment()', () => {
  const onlyInlineCommentTests = [
    {
      input: '// this is an inline comment',
      expectedResult: true,
      description: 'should return true when receiving "// this is an inline comment"',
    },
    {
      input: '/* block comment */',
      expectedResult: false,
      description: 'should return false when receiving "/* block comment */"',
    },
    {
      input: 'height: 30px; // inline comment',
      expectedResult: false,
      description: 'should return false when receiving "height: 30px; // inline comment"',
    },
    {
      input: 'height: 30px;',
      expectedResult: false,
      description: 'should return false when receiving anything else',
    },
  ];
  onlyInlineCommentTests.forEach((sample) => {
    it(sample.description, () => {
      assert.equal(onlyInlineComment(sample.input), sample.expectedResult);
    });
  });
});

describe('onlyBlockComment()', () => {
  const onlyBlockCommentTests = [
    {
      input: '/* block comment */',
      expectedResult: true,
      description: 'should return true when receiving "/* block comment */"',
    },
    {
      input: '/* block comment */ height: 30px; /* block comment */',
      expectedResult: false,
      description: 'should return false when receiving "/* block comment */ height: 30px; /* block comment */"',
    },
    {
      input: 'height: 30px;',
      expectedResult: false,
      description: 'should return false when receiving "height: 30px;"'
    },
  ];
  onlyBlockCommentTests.forEach((sample) => {
    it(sample.description, async () => {
      assert.equal(onlyBlockComment(sample.input), sample.expectedResult);
    });
  });
});

describe('removeBlockComments()', () => {
  const removeBlockCommentsTests = [
    {
      input: '/* block comment */',
      expectedResult: '',
      description: 'should return an empty string when receiving "/* block comment */"',
    },
    {
      input: '',
      expectedResult: '',
      description: 'should return an empty string when receiving an empty string',
    },
    {
      input: '/* block comment */ height: 30px; /* block comment */',
      expectedResult: 'height: 30px;',
      description: 'should return "height: 30px;" when receiving "/* block comment */ height: 30px; /* block comment */"',
    },
  ];
  removeBlockCommentsTests.forEach((sample) => {
    it(sample.description, async () => {
      assert.equal(removeBlockComments(sample.input), sample.expectedResult);
    });
  });
});

describe('isNewLine()', () => {
  const isNewLineTests = [
    {
      input: '\n',
      expectedResult: true,
      description: 'should return true when receiving a new line',
    },
    {
      input: 'height: 30px;',
      expectedResult: false,
      description: 'should return false when receiving a new line',
    },
    {
      input: 'height: 30px; \n',
      expectedResult: false,
      description: 'should return false when receiving a "height: 30px;" with a new line char.',
    },
    {
      input: 300,
      expectedResult: false,
      description: 'should return false when receiving a "30"',
    }
  ];
  isNewLineTests.forEach((sample) => {
    it(sample.description, async () => {
      assert.equal(isNewLine(sample.input), sample.expectedResult);
    });
  });
});

describe('hasPX()', () => {
  const hasPXTests = [
    {
      input: 'height: 30px;',
      expectedResult: true,
      description: 'should return true when receiving "height: 30px;"',
    },
    {
      input: 'width: 30vh;',
      expectedResult: false,
      description: 'should return false when receiving "width: 30vh;"',
    },
    {
      input: 300,
      expectedResult: false,
      description: 'should return false when receiving a "30"',
    }
  ];
  hasPXTests.forEach((sample) => {
    it(sample.description, async () => {
      assert.equal(hasPX(sample.input), sample.expectedResult);
    });
  });
});

describe('isString()', () => {
  const isStringTests = [
    {
      input: 'height: 30px;',
      expectedResult: true,
      description: 'should return true when receiving a string',
    },
    {
      input: 812,
      expectedResult: false,
      description: 'should return false when receiving a number',
    },
    {
      input: '812',
      expectedResult: true,
      description: 'should return true when receiving a "812"',
    },
  ];
  isStringTests.forEach((sample) => {
    it(sample.description, async () => {
      assert.equal(isString(sample.input), sample.expectedResult);
    });
  });
});

describe('hasNolsComment()', () => {
  const hasNolsCommentTests = [
    {
      input: 'height: 30px; /* NOLS Converted from: */',
      expectedResult: true,
      description: 'should return true when receiving "height: 30px; /* NOLS Converted from: */"',
    },
    {
      input: 'height: 30px; /* NOLS: */',
      expectedResult: false,
      description: 'should return false when receiving "height: 30px; /* NOLS: */"',
    },
    {
      input: 'height: 30px;',
      expectedResult: false,
      description: 'should return false when receiving "height: 30px;"',
    },
  ];
  hasNolsCommentTests.forEach((sample) => {
    it(sample.description, async () => {
      assert.equal(hasNolsComment(sample.input), sample.expectedResult);
    });
  });
});

describe('getTestingSrc()', () => {
  const temp = [
    {
      input: '',
      expectedResult: './test/test-scss/read-file-tests/only-stylesheets/',
      description: 'should return "./test/test-scss/read-file-tests/only-stylesheets/"',
    },
  ];
  temp.forEach((sample) => {
    it(sample.description, async () => {
      assert.equal(getTestingSrc(), sample.expectedResult);
    });
  });
});

describe('getViewportType()', () => {
  const getViewportTypeTests = [
    {
      input: 'X',
      expectedResult: 'vw',
      description: 'should return "vw" when receiving "X"',
    },
    {
      input: 'Y',
      expectedResult: 'vh',
      description: 'should return "vh" when receiving "Y"',
    },
    {
      input: 'XY',
      expectedResult: null,
      description: 'should return null when receiving "XY"',
    },
    {
      input: null,
      expectedResult: null,
      description: 'should return null when receiving null',
    },
  ];
  getViewportTypeTests.forEach((sample) => {
    it(sample.description, async () => {
      assert.equal(getViewportType(sample.input), sample.expectedResult);
    });
  });
});

describe('cleanLine()', () => {
  const cleanLineTests = [
    {
      input: 'height: 30px; /* NOLS Converted from: */',
      expectedResult: 'height: 30px;',
      description: 'should return "height: 30px;" when receiving "height: 30px; /* NOLS Converted from: */"',
    },
    {
      input: 'height: 30px;',
      expectedResult: 'height: 30px;',
      description: 'should return "height: 30px;" when receiving "height: 30px;"',
    },
  ];
  cleanLineTests.forEach((sample) => {
    it(sample.description, async () => {
      assert.equal(await cleanLine(sample.input), sample.expectedResult);
    });
  });
});

describe('configQuestions()', () => {
  const configQuestionsTests = [
    {
      input: '',
      expectedResult: {
        WIDTH: 375,
        HEIGHT: 812,
        DEFAULT_DIR: './test/test-scss/read-file-tests/only-stylesheets/',
        MODE: 'Default',
        CONFIRM: 'YES',
      },
      description: 'should return the mocha user interaction mock data.',
    },
  ];
  configQuestionsTests.forEach((sample) => {
    it(sample.description, async () => {
      assert.deepEqual(await configQuestions(), sample.expectedResult);
    });
  });
});

describe('setEntry()', () => {
  const setEntryTests = [
    {
      input: 'test/testing',
      expectedResult: './test/testing/',
      description: 'Should return "./test/testing/" when receiving "/test/testing"',
    },
    {
      input: '/test/testing',
      expectedResult: './test/testing/',
      description: 'Should return "./test/testing/" when receiving "/test/testing/"',
    },
    {
      input: './test/testing',
      expectedResult: './test/testing/',
      description: 'Should return "./test/testing/" when receiving "./test/testing"',
    },
    {
      input: './test/testing/',
      expectedResult: './test/testing/',
      description: 'Should return "./test/testing/" when receiving "./test/testing/"',
    },
    {
      input: './test/testing/',
      expectedResult: './test/testing/',
      description: 'Should return "./test/testing/" when receiving "./test/testing/"',
    },
    {
      input: '.test/testing/',
      expectedResult: './test/testing/',
      description: 'Should return "./test/testing/" when receiving ".test/testing/"',
    },
  ];
  setEntryTests.forEach((sample) => {
    it(sample.description, async () => {
      assert.equal(setEntry(sample.input), sample.expectedResult);
    });
  });
});

describe('calculateVW()', () => {
  const calculateVWTests = [
    {
      input: 375,
      expectedResult: 100,
      description: 'should return "100" (vw) when receiving "375" (px)',
    },
    {
      input: 187.5,
      expectedResult: 50,
      description: 'should return "50" (vw) when receiving "187.5" (px)',
    },
    {
      input: '812px',
      expectedResult: null,
      description: 'should return "null" when receiving a non-number',
    },
  ];
  calculateVWTests.forEach((sample) => {
    it(sample.description, async () => {
      assert.equal(calculateVW(sample.input), sample.expectedResult);
    });
  });
});

describe('calculateVH()', () => {
  const calculateVHTests = [
    {
      input: 812,
      expectedResult: 100,
      description: 'should return "100" (vh) when receiving "812" (px)',
    },
    {
      input: 406,
      expectedResult: 50,
      description: 'should return "50" (vh) when receiving "406" (px)',
    },
    {
      input: 162.4,
      expectedResult: 20,
      description: 'should return "20" (vh) when receiving "162.4" (px)'
    },
    {
      input: '812px',
      expectedResult: null,
      description: 'should return "null" when receiving a non-number',
    },
  ];
  calculateVHTests.forEach((sample) => {
    it(sample.description, async () => {
      assert.equal(calculateVH(sample.input), sample.expectedResult);
    });
  });
});

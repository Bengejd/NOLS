import assert from 'assert';

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
  isString,
  verifyConfig,
} from '../src/util/index';
import {doTranslation} from '../src/index';

//region Utility Tests

const commentTests = [
  {input: '//', expectedResult: true, description: 'should return true when receiving "//"'},
  {input: '', expectedResult: false, description: 'should return false when receiving an empty string'},
  {input: 'Hi', expectedResult: false, description: 'should return false when receiving an "Hi" string'},
  {input: '*/', expectedResult: true, description: 'should return true when receiving "*/" string'}
];

describe('Utility: Comment Detection: ', () => {
  commentTests.forEach((sample) => {
    it(sample.description, () => {
      assert.equal(isComment(sample.input), sample.expectedResult);
    })
  });
});

const vhTests = [
  {input: 812, expectedResult: 100, description: 'should return 100 when receiving 812'},
  {input: 406, expectedResult: 50, description: 'should return 50 when receiving 406'},
  {input: 203, expectedResult: 25, description: 'should return 25 when receiving 203'},
  {input: 0, expectedResult: 0, description: 'should return 0 when receiving 0'},
  {input: '812', expectedResult: 100, description: 'should return 100 when receiving a "812"'},
  {input: '812a', expectedResult: null, description: 'should return null when receiving a "812a"'}
];

describe('Utility: VH Calculation', () => {
  vhTests.forEach((sample) => {
    it(sample.description, () => {
      assert.equal(calculateVH(sample.input, 812), sample.expectedResult);
    });
  });
});

const vwTests = [
  {input: 375, expectedResult: 100, description: 'should return 100 when receiving 375'},
  {input: 187.5, expectedResult: 50, description: 'should return 50 when receiving 187.5'},
  {input: 0, expectedResult: 0, description: 'should return 0 when receiving 0'},
  {input: '375', expectedResult: 100, description: 'should return null when receiving a "375"'},
  {input: '375a', expectedResult: null, description: 'should return null when receiving a "375a"'},
];

describe('Utility: VW Calculation', () => {
  vwTests.forEach((sample) => {
    it(sample.description, () => {
      assert.equal(calculateVW(sample.input, 375), sample.expectedResult);
    });
  });
});

const viewportTypeTests = [
  {input: 'X', expectedResult: 'vw', description: 'should return vw when receiving "X"'},
  {input: 'Y', expectedResult: 'vh', description: 'should return vh when receiving "Y"'},
  {input: 'XY', expectedResult: null, description: 'should return null when receiving "XY"'},
  {input: 'asdf', expectedResult: null, description: 'should return null when receiving "asdf"'},
  {input: 1234, expectedResult: null, description: 'should return null when receiving 1234'}
];

describe('Utility: Viewport Types', () => {
  viewportTypeTests.forEach((sample) => {
    it(sample.description, () => {
      assert.equal(getViewportType(sample.input), sample.expectedResult);
    });
  });
});

const newLineTests = [
  {input: '\n', expectedResult: true, description: 'should return true when receiving a new line char'},
  {input: '', expectedResult: true, description: 'should return true when receiving an empty line'},
  {input: ' ', expectedResult: true, description: 'should return true when receiving a spaced string'},
  {input: 'asdf', expectedResult: false, description: 'should return false when receiving any other string'},
  {input: 1234, expectedResult: false, description: 'should return false when receiving any non-string'}
];

describe('Utility: New Line', () => {
  newLineTests.forEach((sample) => {
    it(sample.description, () => {
      assert.equal(isNewLine(sample.input), sample.expectedResult);
    });
  });
});

const translationTypesTest = [
  {input: '  height: 25vh;', expectedResult: 'Y', description: 'should return "Y" when receiving "height"'},
  {input: '  width: 100vw;', expectedResult: 'X', description: 'should return "X" when receiving "width"'},
  {
    input: ' position: absolute;', expectedResult: null,
    description: 'should return null when receiving "position: absolute;"'
  }
];

describe('Utility: Get Translation Type', async () => {
  translationTypesTest.forEach((sample) => {
    it(sample.description, async () => {
      assert.equal(await getTranslationType(sample.input), sample.expectedResult);
    });
  });
});

const verifyConfigTests = [
  {
    input: {height: '812px', width: '375px'}, expectedResult: false,
    description: 'should return false when receiving a string'
  },
  {
    input: {height: 812, width: 375}, expectedResult: true,
    description: 'should return true when receiving height: 812 && width: 375'
  },
  {
    input: {height: 0, width: 0}, expectedResult: false,
    description: 'should return false when receiving height: 0 && width: 0'
  },
  {
    input: {height: -100, width: -100}, expectedResult: false,
    description: 'should return false when receiving height: -100 && width: -100'
  }
];

describe('Utility: Verify config', () => {
  verifyConfigTests.forEach((sample) => {
    it(sample.description, () => {
      assert.equal(verifyConfig(sample.input.height, sample.input.width), sample.expectedResult);
    });
  });
});

const isDirectoryTests = [
  {input: __dirname, expectedResult: true, description: `should return true when receiving ${__dirname}`},
  {
    input: '/foo/bar/baz.js', expectedResult: false,
    description: 'should return false when receiving "/foo/bar/baz.js"'
  },
  {
    input: `${__dirname}/index.js`, expectedResult: false,
    description: 'should return false when receiving "test/index.js"'
  }
];

describe('Utility: Is Directory', () => {
  isDirectoryTests.forEach((sample) => {
    it(sample.description, () => {
      assert.equal(isDirectory(sample.input), sample.expectedResult);
    });
  });
});

const hasPXTests = [
  {input: '812px', expectedResult: true, description: 'should return true when receiving "812px"'},
  {input: '812%', expectedResult: false, description: 'should return false when receiving "812%"'},
  {input: '812vh', expectedResult: false, description: 'should return false when receiving "812vh"'},
  {input: '812em', expectedResult: false, description: 'should return false when receiving "812em"'},
  {input: '812rem', expectedResult: false, description: 'should return false when receiving "812rem"'},
  {input: 812, expectedResult: false, description: 'should return false when receiving 812'},
  {input: null, expectedResult: false, description: 'should return false when receiving null'}
];

describe('Utility: hasPX()', () => {
  hasPXTests.forEach((sample) => {
    it(sample.description, () => {
      assert.equal(hasPX(sample.input), sample.expectedResult);
    });
  });
});

const isStringTests = [
  {input: '', expectedResult: true, description: 'should return true when receiving an empty string'},
  {input: 123, expectedResult: false, description: 'should return false when receiving 123'},
  {input: '456', expectedResult: true, description: 'should return true when receiving "456"'},
  {input: null, expectedResult: false, description: 'should return false when receiving null'}
];

describe('Utility: isString()', () => {
  isStringTests.forEach((sample) => {
    it(sample.description, () => {
      assert.equal(isString(sample.input), sample.expectedResult);
    });
  });
});

const hasConfigFileTests = [
  // Placeholder tests just for code coverage.
  {input: null, expectedResult: true || false, description: 'should return false when no rsoconfig.json file exists'},
  {input: null, expectedResult: true || false, description: 'should return true when rsoconfig.json file exists'},
];

describe('Utility: hasConfigFile()', () => {
  hasConfigFileTests.forEach((sample) => {
    it(sample.description, () => {
      assert.equal(hasConfigFile(), sample.expectedResult);
    })
  });
});

//endregion Utility Tests

//region Main Tests

const doTranslationTests = [
  {
    input: {line: 'width: 375px;', type: 'X'}, expectedResult: "width: 100vw; // RSO Converted from: 375px;",
    description: 'should return "width: 100vw; // RSO Converted from: 375px;" when receiving "width: 375px;"'
  },
  {
    input: {line: 'height: 203px;', type: 'Y'}, expectedResult: "height: 25vh; // RSO Converted from: 203px;",
    description: 'should return " height: 25vh; // RSO Converted from: 203px;" when receiving "height: 203px;"'
  },
  // TODO: Add more tests for doTranslation()
];

describe('Main: doTranslation()', () => {
  doTranslationTests.forEach((sample) => {
    it(sample.description, async () => {
      assert.equal(await doTranslation(sample.input.line, sample.input.type), sample.expectedResult);
    });
  });
});



//endregion Main Tests

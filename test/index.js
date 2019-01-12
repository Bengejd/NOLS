import assert from 'assert';

const commentTests = [
  {input: '//', expectedResult: true, description: 'should return true when receiving "//"'},
  {input: '', expectedResult: false, description: 'should return false when receiving an empty string'},
  {input: 'Hi', expectedResult: false, description: 'should return false when receiving an "Hi" string'},
  {input: '*/', expectedResult: true, description: 'should return true when receiving "*/" string'}
];

describe('Utility: Comment Detection: ', () => {
  commentTests.forEach((sample) => {
    it(sample.description, function() {
      assert.equal(isComment(sample.input), sample.expectedResult);
    });
  });
});

import assert from 'assert';

import {isComment} from '../dist/util/index';

const commentInputs = [
  {input: '//', expectedResult: true, description:'should return true when receiving "//"'},
  {input: '', expectedResult: false, description: 'should return false when receiving an empty string'},
  {input: 'Hi', expectedResult: false, description: 'should return false when receiving an "Hi" string'},
];

describe('Comment Detection: ', () => {
  commentInputs.forEach((sample) => {
    it(sample.description, () => {
      assert.equal(isComment(sample.input), sample.expectedResult);
    })
  });
});



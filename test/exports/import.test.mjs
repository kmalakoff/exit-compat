import assert from 'assert';
import exit from 'exit-compat';

describe('exports .mjs', () => {
  it('default', () => {
    assert.equal(typeof exit, 'function');
  });
});

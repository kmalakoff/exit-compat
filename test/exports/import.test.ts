import assert from 'assert';
import exit from 'exit-compat';

describe('exports .ts', () => {
  it('default', () => {
    assert.equal(typeof exit, 'function');
  });
});

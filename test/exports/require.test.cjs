const assert = require('assert');
const exit = require('exit-compat');

describe('exports .cjs', () => {
  it('default', () => {
    assert.equal(typeof exit, 'function');
  });
});

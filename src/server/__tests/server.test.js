const greet = require("../server");

describe('a thing', () => {
  it('works', () => {
    expect(true).toBe(true);
  });

  it('does not work', () => {
    expect(false).toBe(true);
  });
});

describe('greeter', function () {
  it('should say Hello to the World', function () {
    expect(greet('World')).toEqual('Hello, World!');
  });
});
const test = require("ava");
const util = require("../../lib/util.js");

test("extractErrors should return error message only and not the path",
  function(t) {
    const input = [{
      message: "\"username\" cannot be empty",
      path: "username"
    }];
    const actual = util.extractErrors(input);
    const expected = [input[0].message];
    t.same(actual, expected);
    t.notOk(actual[0].path);
    t.end();
  });

test("extractErrors should return one error message per path", function(t) {
  const input = [{
    message: "\"email\" cannot be empty",
    path: "email"
  }, {
    message: "\"email\" must be valid",
    path: "email"
  }];
  const expected = [input[0].message];
  const actual = util.extractErrors(input);
  t.same(actual, expected);
  t.end();
});

test("extractErrors can return more than one error", function(t) {
  const input = [{
    message: "\"email\" cannot be empty",
    path: "email"
  }, {
    message: "\"username\" must be valid",
    path: "username"
  }];

  const expected = [input[0].message, input[1].message];
  const actual = util.extractErrors(input);
  t.same(actual, expected);
  t.end();
});

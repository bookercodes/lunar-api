import sut from "../../../lib/sut";
import chai from "chai";

const assert = chai.assert;

suite("sut", function() {

  test("extractErrors() returns array", function() {
    const input = [{
      message: "\"username\" cannot be empty",
      path: "username"
    }];

    const actual = sut.extractErrors(input);

    assert.isArray(actual);
  });

  test("extractErrors() returns unmodified error message", function() {
    const message = "\"username\" cannot be empty";
    const input = [{
      message: message,
      path: "username"
    }];

    const actual = sut.extractErrors(input);

    const expected = [message];
    assert.deepEqual(actual, expected);
    assert.notOk(expected[0].path);
  });

  test("extractErrors() returns just one error per path", function() {
    const message = "\"email\" cannot be empty";
    const input = [{
      message: message,
      path: "email"
    }, {
      message: "\"email\" must be valid",
      path: "email"
    }];

    const actual = sut.extractErrors(input);

    const expected = [message];
    assert.deepEqual(actual, expected);
  });

  test("extractErrors() can return many errors", function() {
    const message1 =  "\"email\" cannot be empty";
    const message2 =  "\"username\" must be valid";
    const input = [{
      message: message1,
      path: "email"
    }, {
      message: message2,
      path: "username"
    }];

    const actual = sut.extractErrors(input);

    const expected = [message1, message2];
    assert.deepEqual(actual, expected);
  });
});

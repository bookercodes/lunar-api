import sut from "../../../lib/util";
import chai from "chai";

const expect = chai.expect;

suite("util", function() {

  test("exports module", function() {
    expect(sut)
      .to
      .not
      .be
      .empty;
  });

  test("extractErrors() should return an array", function() {
    const input = [{
      message: "\"username\" cannot be empty",
      path: "username"
    }];

    const actual = sut.extractErrors(input);

    expect(actual)
      .to
      .be
      .instanceof(Array);
  });

  test("extractErrors() with empty array should return an empty array",
    function() {
      const input = [];

      const actual = sut.extractErrors(input);

      expect(actual)
        .to
        .be
        .empty;
    });

  test("extractErrors() should return unmodified error message and path",
    function() {
      const input = [{
        message: "\"username\" cannot be empty",
        path: "username"
      }];

      const actual = sut.extractErrors(input);

      const expected = [{
        path: "username",
        message: "\"username\" cannot be empty"
      }];

      expect(actual)
        .to
        .eql(expected);
    });

  test("extractErrors() should return message and path properties only",
    function() {
      const input = [{
        message: "\"username\" cannot be empty",
        path: "username",
        foo: "bar"
      }];

      const actual = sut.extractErrors(input);

      const expected = [{
        path: "username",
        message: "\"username\" cannot be empty"
      }];

      expect(actual)
        .to
        .eql(expected);
    });

  test("extractErrors() should only return one error per path", function() {
    const input = [{
      message: "\"username\" cannot be empty",
      path: "username"
    }, {
      message: "\"username\" cannot be foo",
      path: "username"
    }];

    const actual = sut.extractErrors(input);

    const expected = [{
      message: "\"username\" cannot be empty",
      path: "username"
    }];
    expect(actual)
      .to
      .eql(expected);
  });

  test("extractErrors() can return many errors", function() {
    const input = [{
      message: "\"username\" cannot be empty",
      path: "username"
    }, {
      message: "\"email\" cannot be empty",
      path: "email"
    }];

    const actual = sut.extractErrors(input);

    const expected = [{
      path: "username",
      message: "\"username\" cannot be empty"
    }, {
      path: "email",
      message: "\"email\" cannot be empty"
    }];
    expect(actual)
      .to
      .eql(expected);
  });

  test("extractErrors() should return correct result", function() {
    const input = [{
      message: "\"username\" cannot be empty",
      path: "username"
    }, {
      message: "\"username\" cannot be foo",
      path: "username"
    }, {
      message: "\"email\" cannot be empty",
      path: "email"
    }];

    const actual = sut.extractErrors(input);

    const expected = [{
      message: "\"username\" cannot be empty",
      path: "username"
    }, {
      message: "\"email\" cannot be empty",
      path: "email"
    }];
    expect(actual)
      .to
      .eql(expected);
  });

});

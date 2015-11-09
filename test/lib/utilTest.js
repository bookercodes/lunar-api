import util from "../../lib/util.js";
import chai from "chai";

const expect = chai.expect;

describe("extractErrors", function() {
  it("should return error message only and not the path",
    function() {
      const input = [{
        message: "\"username\" cannot be empty",
        path: "username"
      }];
      const actual = util.extractErrors(input);
      const expected = [input[0].message];
      expect(actual).to.eql(expected);
      expect(actual[0].path).to.not.be.ok;
    });

  it("should return one error message per path", function() {
    const input = [{
      message: "\"email\" cannot be empty",
      path: "email"
    }, {
      message: "\"email\" must be valid",
      path: "email"
    }];
    const expected = [input[0].message];
    const actual = util.extractErrors(input);
    expect(actual).to.eql(expected);
  });

  it("can return more than one error", function() {
    const input = [{
      message: "\"email\" cannot be empty",
      path: "email"
    }, {
      message: "\"username\" must be valid",
      path: "username"
    }];

    const expected = [input[0].message, input[1].message];
    const actual = util.extractErrors(input);
    expect(actual).to.eql(expected);
  });
});

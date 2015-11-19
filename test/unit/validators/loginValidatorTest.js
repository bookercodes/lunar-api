import chai from "chai";

const expect = chai.expect;

suite("loginValidator", function() {

  test("exports module", function() {
    const sut =  require("../../../validators/loginValidator.js");
    expect(sut)
      .to
      .not
      .be
      .empty;
  });

});

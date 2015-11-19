import chai from "chai";
import httpMocks from "node-mocks-http";

const expect = chai.expect;

suite("loginValidator", function() {

  test("exports module", function() {
    // setup
    const sut = require("../../../validators/loginValidator.js");

    // verify
    expect(sut)
      .to
      .not
      .be
      .empty;
  });

  test("validateBody() returns an empty error array when input is valid",
    function() {
      // setup
      const sut = require("../../../validators/loginValidator.js");
      const req = httpMocks.createRequest({
        body: {
          username: "username",
          password: "some password",
        }
      });
      const res = {};

      // exercise
      // verify
      return expect(sut.validateBody(req, res))
        .to
        .eventually
        .have
        .length(0);
    });


  const invalidUsernames = {
    "empty username": "",
    "username shorter than 3 chars": "a",
    "username containing symbols": "username$",
    "username containing spaces": "user name",
    "username that isn't a string": 42,
    "username longer than 30 chars": new Array(31 + 1).join("x")
  };
  for (const key in invalidUsernames) {
    test(`validateBody() with ${key} should return an error`, function() {
      // setup
      const invalidUsername = invalidUsernames[key];
      const sut = require("../../../validators/loginValidator.js");
      const req = httpMocks.createRequest({
        body: {
          username: invalidUsername,
          password: "some password",
        }
      });
      const res = {};

      // exercise
      return sut
        .validateBody(req, res)
        .then(function(errors) {
          // verify
          expect(errors)
            .to
            .have
            .length(1,
              `expected input "${invalidUsername}" to cause an error, but it didn't.`
            );
          expect(errors[0].message)
            .to
            .contain("username");
          expect(errors[0].path)
            .to
            .equal("username");
        });
    });
  }

  const invalidPasswords = {
    "empty password": "",
    "password shorer than 6 chars": "passw",
    "password that isn't a string": 42,
  };
  for (const key in invalidPasswords) {
    test(`validateBody() with ${key} should return an error`, function() {
      // setup
      const invalidPassword = invalidPasswords[key];
      const sut = require("../../../validators/loginValidator");
      const req = httpMocks.createRequest({
        body: {
          username: "username",
          password: invalidPassword,
        }
      });
      const res = {};

      // exercise
      return sut
        .validateBody(req, res)
        .then(function(errors) {
          // verify
          expect(errors)
            .to
            .have
            .length(1,
              `expected input "${invalidPassword}" to cause an error, but it didn't.`
            );
          expect(errors[0].message)
            .to
            .contain("password");
          expect(errors[0].path)
            .to
            .equal("password");
        });
    });
  }
});

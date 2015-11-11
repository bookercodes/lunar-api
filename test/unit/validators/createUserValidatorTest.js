import chai from "chai";
import mockery from "mockery";
import httpMocks from "node-mocks-http";
import sinon from "sinon";
import Promise from "bluebird";
import chaiAsPromised from "chai-as-promised";

chai.use(chaiAsPromised);
const expect = chai.expect;

function requireSut(validateAvailabilityStub) {
  const contextMock = {
    models: {
      User: {
        validateAvailability: validateAvailabilityStub
      }
    }
  };
  mockery.registerMock("sequelize-context", contextMock);
  return require("../../../validators/createUserValidator.js");
}

suite("createUserValidator", function() {

  setup(function() {
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    });
  });

  teardown(function() {
    mockery.disable();
  });

  test("exports module", function() {
    const sut = require("../../../validators/createUserValidator.js");
    expect(sut)
      .to
      .not
      .be
      .empty;
  });

  test("validateBody() returns an empty error array when input is valid",
    function() {
      const validateAvailabilityStub = function() {
        return new Promise(resolve => resolve([]));
      };
      const sut = requireSut(validateAvailabilityStub);
      const req = httpMocks.createRequest({
        body: {
          username: "username",
          password: "some password",
          email: "username@domain.com"
        }
      });
      const res = {};
      return expect(sut.validateBody(req, res))
        .to
        .eventually
        .have
        .length(0);
    });

  test(
    "validateBody() returns populated errors array when username is invalid",
    function() {
      const invalidUsernames = [
        "",
        "a",
        "username$",
        "user name",
        42,
        new Array(31 + 1).join("x")
      ];
      const validateAvailabilityStub = function() {
        return new Promise(resolve => resolve([]));
      };
      const sut = requireSut(validateAvailabilityStub);
      invalidUsernames.forEach(function(invalidUsername) {
        const req = httpMocks.createRequest({
          body: {
            username: invalidUsername,
            password: "some password",
            email: "username@domain.com"
          }
        });
        const res = {};
        return expect(sut.validateBody(req, res))
          .to
          .eventually
          .have
          .length(1);
      });
    });

  test(
    "validateBody() returns populated errors array when password is invalid",
    function() {
      const invalidPasswords = [
        "",
        "passw",
        42,
        new Array(101 + 1).join("x")
      ];
      const validateAvailabilityStub = function() {
        return new Promise(resolve => resolve([]));
      };
      const sut = requireSut(validateAvailabilityStub);
      invalidPasswords.forEach(function(invalidPassword) {
        const req = httpMocks.createRequest({
          body: {
            username: "username",
            password: invalidPassword,
            email: "username@domain.com"
          }
        });
        const res = {};
        return expect(sut.validateBody(req, res))
          .to
          .eventually
          .have
          .length(1);
      });
    });

  test(
    "validateBody() returns populated errors array when email is invalid",
    function() {
      const invalidEmails = [
        "",
        "email",
        42
      ];
      const validateAvailabilityStub = function() {
        return new Promise(resolve => resolve([]));
      };
      const sut = requireSut(validateAvailabilityStub);
      invalidEmails.forEach(function(invalidEmail) {
        const req = httpMocks.createRequest({
          body: {
            username: "username",
            password: "some password",
            email: invalidEmail
          }
        });
        const res = {};
        return expect(sut.validateBody(req, res))
          .to
          .eventually
          .have
          .length(1);
      });
    });

  test(
    "validateBody() returns populated errors array when unknown field is present",
    function() {
      const validateAvailabilityStub = function() {
        return new Promise(resolve => resolve([]));
      };
      const sut = requireSut(validateAvailabilityStub);
      const req = httpMocks.createRequest({
        body: {
          username: "username",
          password: "some password",
          email: "foo@bar.com",
          foo: "fosdfsf"
        }
      });
      const res = {};
      return expect(sut.validateBody(req, res))
        .to
        .eventually
        .have
        .length(1);
    });

  test(
    "validateBody() returns populated errors array when username is taken",
    function() {
      const validateAvailabilityStub = function() {
        return new Promise(resolve => resolve([
          "\"username\" is taken"
        ]));
      };
      const sut = requireSut(validateAvailabilityStub);
      const req = httpMocks.createRequest({
        body: {
          username: "username",
          password: "some password",
          email: "foo@bar.com",
        }
      });
      const res = {};
      return expect(sut.validateBody(req, res))
        .to
        .eventually
        .have
        .length(1);
    });

  test("validateAvailability() can return many errors", function() {
    const validateAvailabilityStub = function() {
      return new Promise(resolve => resolve([
        "\"username\" is taken"
      ]));
    };
    const sut = requireSut(validateAvailabilityStub);
    const req = httpMocks.createRequest({
      body: {
        username: "",
        password: "",
        email: "",
      }
    });
    const res = {};
    return expect(sut.validateBody(req, res))
      .to
      .eventually
      .have
      .length(4);
  });
});

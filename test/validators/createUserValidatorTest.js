import chai from "chai";
import mockery from "mockery";
import httpMocks from "node-mocks-http";
import sinon from "sinon";
import Promise from "bluebird";
import chaiAsPromised from "chai-as-promised";

chai.use(chaiAsPromised);
const expect = chai.expect;

/**
 * Composes the system under test's dependency graph before returning it. We
 * don't want the system under test to interface with the database so we
 * replace the database module at the seam with a mock, using mockery.
 * @param  {Function} validateAvailabilityStub The function to use instead of
 * calling the database.
 */
function importSut(validateAvailabilityStub) {
  const contextMock = {
    models: {
      User: {
        validateAvailability: validateAvailabilityStub
      }
    }
  };
  mockery.registerMock("sequelize-context", contextMock);
  return require("../../validators/createUserValidator");
}

describe("createUserValidator", function() {

  beforeEach(function() {
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    });
  });

  afterEach(function() {
    mockery.disable();
  });

  describe("with valid body, validateBody func", function() {
    it("should return no errors", function() {
      const validateAvailabilityStub = function() {
        return new Promise(resolve => resolve([]));
      };
      const sut = importSut(validateAvailabilityStub);
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
  });

  describe("with invalid username, validateBody func", function() {
    it("should return an error", function() {
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
      const sut = importSut(validateAvailabilityStub);
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
  });

  describe("with invalid password, validateBody func", function() {
    it("should return an error", function() {
      const invalidPasswords = [
        "",
        "passw",
        42,
        new Array(101 + 1).join("x")
      ];
      const validateAvailabilityStub = function() {
        return new Promise(resolve => resolve([]));
      };
      const sut = importSut(validateAvailabilityStub);
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
  });

  describe("with invalid email, validateBody func", function() {
    it("should return an error", function() {
      const invalidEmails = [
        "",
        "email",
        42
      ];
      const validateAvailabilityStub = function() {
        return new Promise(resolve => resolve([]));
      };
      const sut = importSut(validateAvailabilityStub);
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
  });

  describe("with unrecognized field, validateBody func", function() {
    it("should return an error", function() {
      const validateAvailabilityStub = function() {
        return new Promise(resolve => resolve([]));
      };
      const sut = importSut(validateAvailabilityStub);
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
  });

  describe("duplicate email", function() {
    it("should return an error", function() {
      const validateAvailabilityStub = function() {
        return new Promise(resolve => resolve(["\"username\" is taken"]));
      };
      const sut = importSut(validateAvailabilityStub);
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
  });

  describe("can return more than one error", function() {
    it("should return an error", function() {
      const validateAvailabilityStub = function() {
        return new Promise(resolve => resolve(["\"username\" is taken"]));
      };
      const sut = importSut(validateAvailabilityStub);
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
});

import chai from "chai";
import mockery from "mockery";
import httpMocks from "node-mocks-http";
import sinon from "sinon";
import Promise from "bluebird";
import chaiAsPromised from "chai-as-promised";

chai.use(chaiAsPromised);
const expect = chai.expect;

describe("createUserValidator", function() {
  beforeEach(function() {
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    });
  });

  describe("with valid body, validateBody func", function() {
    it("should return no errors", function() {
      const contextMock = {
        models: {
          User: {
            validateAvailability: function() {
              return new Promise(resolve => resolve([]));
            }
          }
        }
      };
      mockery.registerMock("sequelize-context", contextMock);
      const createUserValidator = require(
        "../../validators/createUserValidator");
      const req = httpMocks.createRequest({
        body: {
          username: "username",
          password: "some password",
          email: "username@domain.com"
        }
      });
      const res = {};
      return expect(createUserValidator.validateBody(req, res))
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
      const contextMock = {
        models: {
          User: {
            validateAvailability: function() {
              return new Promise(resolve => resolve([]));
            }
          }
        }
      };
      mockery.registerMock("sequelize-context", contextMock);
      const createUserValidator = require(
        "../../validators/createUserValidator");
      invalidUsernames.forEach(function(invalidUsername) {
        const req = httpMocks.createRequest({
          body: {
            username: invalidUsername,
            password: "some password",
            email: "username@domain.com"
          }
        });
        const res = {};
        return expect(createUserValidator.validateBody(req, res))
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
      const contextMock = {
        models: {
          User: {
            validateAvailability: function() {
              return new Promise(resolve => resolve([]));
            }
          }
        }
      };
      mockery.registerMock("sequelize-context", contextMock);
      const createUserValidator = require(
        "../../validators/createUserValidator");
      invalidPasswords.forEach(function(invalidPassword) {
        const req = httpMocks.createRequest({
          body: {
            username: "username",
            password: invalidPassword,
            email: "username@domain.com"
          }
        });
        const res = {};
        return expect(createUserValidator.validateBody(req, res))
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
      const contextMock = {
        models: {
          User: {
            validateAvailability: function() {
              return new Promise(resolve => resolve([]));
            }
          }
        }
      };
      mockery.registerMock("sequelize-context", contextMock);
      const createUserValidator = require(
        "../../validators/createUserValidator");
      invalidEmails.forEach(function(invalidEmail) {
        const req = httpMocks.createRequest({
          body: {
            username: "username",
            password: "some password",
            email: invalidEmail
          }
        });
        const res = {};
        return expect(createUserValidator.validateBody(req, res))
          .to
          .eventually
          .have
          .length(1);
      });
    });
  });

  describe("with unrecognized field, validateBody func", function() {
    it("should return an error", function() {
      const contextMock = {
        models: {
          User: {
            validateAvailability: function() {
              return new Promise(resolve => resolve([]));
            }
          }
        }
      };
      mockery.registerMock("sequelize-context", contextMock);
      const createUserValidator = require(
        "../../validators/createUserValidator");
      const req = httpMocks.createRequest({
        body: {
          username: "username",
          password: "some password",
          email: "foo@bar.com",
          foo: "fosdfsf"
        }
      });
      const res = {};
      return expect(createUserValidator.validateBody(req, res))
        .to
        .eventually
        .have
        .length(1);
    });
  });

  describe("duplicate email", function() {
    it("should return an error", function() {
      const contextMock = {
        models: {
          User: {
            validateAvailability: function() {
              return new Promise(resolve => resolve(["\"username\" is taken"]));
            }
          }
        }
      };
      mockery.registerMock("sequelize-context", contextMock);
      const createUserValidator = require(
        "../../validators/createUserValidator");
      const req = httpMocks.createRequest({
        body: {
          username: "username",
          password: "some password",
          email: "foo@bar.com",
        }
      });
      const res = {};
      return expect(createUserValidator.validateBody(req, res))
        .to
        .eventually
        .have
        .length(1);
    });
  });

  describe("can return more than one error", function() {
    it("should return an error", function() {
      const contextMock = {
        models: {
          User: {
            validateAvailability: function() {
              return new Promise(resolve => resolve(["\"username\" is taken"]));
            }
          }
        }
      };
      mockery.registerMock("sequelize-context", contextMock);
      const createUserValidator = require(
        "../../validators/createUserValidator");
      const req = httpMocks.createRequest({
        body: {
          username: "",
          password: "",
          email: "",
        }
      });
      const res = {};
      return expect(createUserValidator.validateBody(req, res))
        .to
        .eventually
        .have
        .length(4);
    });
  });



































  afterEach(function() {
    mockery.disable();
  });
});

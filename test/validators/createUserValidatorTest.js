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
      const res = { };
      return expect(createUserValidator.validateBody(req, res))
        .to
        .eventually
        .have
        .length(0);
    });


  });
  afterEach(function() {
    mockery.disable();
  });
});

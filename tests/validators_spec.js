import validators from "../validators";
import chai from "chai";
import httpMocks from "node-mocks-http";
import sinon from "sinon";

const expect = chai.expect;

describe("joinBody", function() {
  describe("a valid join body", function() {
    it("should pass", function() {
      const req = httpMocks.createRequest({
        body: {
          username: "username",
          password: "some password",
          email: "username@domain.com"
        }
      });
      const res = {};
      const next = sinon.spy();

      validators.joinBody(req, res, next);

      expect(next.calledOnce).to.be.true;
      const args = next.args[0];
      expect(args, "input is valid but got rejected").to.be.empty;
    });
  });

  describe("an invalid username", function() {
    it("should fail", function() {
      const invalidUsernames = [
        "",
        "a",
        "username$",
        "user name",
        42,
        new Array(31 + 1).join("x")
      ];
      invalidUsernames.forEach(function(username) {
        const req = httpMocks.createRequest({
          body: {
            username: username,
            password: "passw0rd",
            email: "username@domain.com"
          }
        });
        const res = {};
        const next = sinon.spy();

        validators.joinBody(req, res, next);

        const args = next.args[0];
        expect(args, "'" + username + "' should have be rejected").to.not.be.empty;
        const error = args[0].data[0];
        expect(error.path).to.equal("body.username");
      });
    });

  });


  describe("an invalid password", function() {
    it("should fail", function() {
      const invalidPasswords = [
        "",
        "passw",
        42,
        new Array(101 + 1).join("x")
      ];
      invalidPasswords.forEach(function(password) {
        const req = httpMocks.createRequest({
          body: {
            username: "username",
            password: password,
            email: "username@domain.com"
          }
        });
        const res = {};
        const next = sinon.spy();

        validators.joinBody(req, res, next);

        const args = next.args[0];
        expect(args, "'" + password + "' should have be rejected").to.not.be.empty;
        const error = args[0].data[0];
        expect(error.path).to.equal("body.password");
      });
    });
  });

  describe("an invalid email", function() {
    it("should fail", function() {
      const invalidEmails = [
        "",
        "email",
        42
      ];
      invalidEmails.forEach(function(email) {
        const req = httpMocks.createRequest({
          body: {
            username: "username",
            password: "passw0rd",
            email: email
          }
        });
        const res = {};
        const next = sinon.spy();

        validators.joinBody(req, res, next);

        const args = next.args[0];
        expect(args, "'" + email + "' should have be rejected").to.not.be.empty;
        const error = args[0].data[0];
        expect(error.path).to.equal("body.email");
      });
    });
  });
});

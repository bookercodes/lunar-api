import test from "tape";
import httpMocks from "node-mocks-http";
import sinon from "sinon";
import sut from "../../validators/createUserValidator";

// valid body
// invalid username
// invalid password
// invalid email
// duplicate username
// disallowed field
// more than one error is returned if more than one error occured
// only one error per field is returned at a time, even if there are more than
// one
// error contains "username", "password", etc

test("valid body", function(assert) {
  const validBody = {
    username: "user",
    password: "p@55w0rd",
    email: "user@domain.com"
  };

  assert.plan(1);

  const req = httpMocks.createRequest({
    body: {
      username: "username",
      password: "some password",
      email: "username@domain.com"
    }
  });
  const res = {};
  const next = sinon.spy();

  sut(req, res, next);

  assert.ok(next.calledOnce);
});


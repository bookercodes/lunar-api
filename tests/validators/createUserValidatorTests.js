import test from "tape";
import httpMocks from "node-mocks-http";
import sinon from "sinon";
import sut from "../../validators/createUserValidator";

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

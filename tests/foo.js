import chai from "chai";
import request from "supertest";
import server from "../"; 

describe("join", function() {
  it ("should return 400 when no body is specified", function(done) {
    request(server)
      .post("/users")
      .expect(400, done);
  });

  it("should return 200 when body is specified", function(done) {
    request(server)
      .post("/users")
      .set('Content-Type', 'application/json')
      .send({
        username: "foo",
        email: "foo@bar.co",
        password: "bar"
      })
      .expect(201, done);
  });
});

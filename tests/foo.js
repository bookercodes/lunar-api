import chai from "chai";
import request from "supertest";
import server from "../"; 

describe("join", function() {
  it ("should return 400 when no body is specified", function(done) {
    request(server)
      .post("/users")
      .expect(400, done);
  });
});

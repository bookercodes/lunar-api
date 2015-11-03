import chai from "chai";
import server from "../";
import dbContext from "sequelize-context";
import config from "config";

const expect = chai.expect;
const request = require("supertest")(server.listen());

describe("foo", function() {
  it("should return 400", function(done) {
    request
      .post("/users")
      .expect(400, done);
  });

  it("should return 201", function(done) {
    request
      .post("/users")
      .set("Content-Type", "application/json")
      .send({
        username: "username",
        email: "username@domain.com",
        password: "password123"
      })
      .expect(201, done);
  });

});

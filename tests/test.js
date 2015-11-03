import chai from "chai";
import server from "../";
import dbContext from "sequelize-context";
import config from "config";

const expect = chai.expect;
const request = require("supertest")(server.listen());

describe("foo", function() {
  beforeEach(function(done) {
    dbContext.connection.sync({
      force: true
    }).then(function() {
      done();
    });
  });

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

  it("should store user in db", function(done) {
    const user = {
      username: "username",
      email: "username@domain.com",
      password: "password123"
    };
    request
      .post("/users")
      .set("Content-Type", "application/json")
      .send(user)
      .end(function(err, res) {
        expect(err).to.not.exist;
        dbContext
          .models
          .User
          .findOne({
            where: {
              username: user.username
            }
          })
          .then(function(user) {
            expect(user).to.exist;
            done();
          });
      });
  });

});

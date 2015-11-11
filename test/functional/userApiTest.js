import chai from "chai";
import config from "config";
import db from "sequelize-context";
import server from "../../server.js";
import request from "supertest-as-promised";

const expect = chai.expect;

describe("post to '/users' route", function() {

  before(function() {
    db.connect(config.database, config.username, config.password, {
      logging: false,
      dialect: config.dialect
    });
  });

  beforeEach(function() {
    return db
      .connection
      .sync({
        force: true
      });
  });

  describe("with empty request body", function() {
    it("should return 400", function() {
      return request(server)
        .post("/users")
        .expect(400);
    });
  });

  describe("with invalid body", function() {
    it("should return 400 and errors", function(done) {
      return request(server)
        .post("/users")
        .send({
          username: "",
          password: "",
          email: ""
        })
        .end(function(err, res) {
          expect(res.status).to.equal(400);
          expect(res.body).to.have.length(3);
          done();
        });
    });
  });


  describe("with valid body", function() {
    it("should return 201", function() {
      return request(server)
        .post("/users")
        .send({
          username: "username1",
          password: "passw0rd",
          email: "username@domain.com"
        })
        .expect(201);
    });

    it("should store user in db", function() {
      const user = {
        username: "username1",
        password: "passw0rd",
        email: "username@domain.com"
      };
      return request(server)
        .post("/users")
        .send(user)
        .then(function(res) {
          return db
            .models
            .User
            .findOne({
              where: {
                username: "username1"
              }
            })
            .then(function(user) {
              expect(user).to.exist;
            });
        });
    });
  });


});

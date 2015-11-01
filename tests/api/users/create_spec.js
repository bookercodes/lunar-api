import chai from "chai";
import request from "supertest";
import server from "../../../";
import dbContext from "sequelize-context";
import config from "config";

const expect = chai.expect;

describe("/users api", function() {

  describe("create (post)", function() {

    describe("an empty model", function() {
      it("should return 400", function(done) {
        request(server.app)
          .post("/users")
          .expect(400, done);
      });
    });


    describe("a valid model", function() {
      beforeEach(function(done) {
        dbContext
          .connection
          .sync({
            force: true
          })
          .then(() => done());
      });
      it("should return 201", function(done) {
        request(server.app)
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
        const model = {
          username: "username",
          email: "username@domain.com",
          password: "password123"
        };
        request(server.app)
          .post("/users")
          .send(model)
          .expect(201)
          .end(function(err, res) {
            dbContext
              .models
              .User
              .findOne({
                where: {
                  username: model.username
                }
              })
              .then(function(user) {
                expect(user).to.exist;
                user = user.dataValues;
                expect(user.userId).to.exist;
                expect(user.username).to.equal(model.username);
                expect(user.password).to.not.equal(model.password);
                done();
              });
          });
      });

    });

    describe("an erroneous  model", function() {
      it("should return 400", function() {
        request(server.app)
          .post("/users")
          .send({
            username: "",
            email: "email",
            password: "weak"
          })
          .expect(400)
          .expect('Content-Type', /json/)
          .end(function(err, res) {
            expect(res.body).to.have.length(1);
            expect(res.body[0].path).to.equal("body.username");
            done();
          });
      });
    });

    describe("duplicate username", function() {
      beforeEach(function(done) {
        dbContext
          .connection
          .sync({
            force: true
          })
          .then(() => done());
      });
      it("should return 400", function(done) {
        const username = "username";
        dbContext
          .models
          .User
          .create({
            username: username,
            email: "username@domain.com",
            password: "password123"
          })
          .then(function() {
            request(server.app)
              .post("/users")
              .send({
                username: username,
                email: "username1@domain.com",
                password: "password123"
              })
              .expect(400, done);
          });

      });
    });

    describe("duplicate email", function() {
      beforeEach(function(done) {
        dbContext
          .connection
          .sync({
            force: true
          })
          .then(() => done());
      });
      it("should return 400", function(done) {
        const email = "username@domain.com";
        dbContext
          .models
          .User
          .create({
            username: "username",
            email: email,
            password: "password123"
          })
          .then(function() {
            request(server.app)
              .post("/users")
              .send({
                username: "username1",
                email: email,
                password: "password123"
              })
              .expect(400, done);
          });

      });
    });
  });


  after(() => server.server.close());
});

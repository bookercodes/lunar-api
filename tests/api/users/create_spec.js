import chai from "chai";
import request from "supertest";
import server from "../../../";
import orm from "../../../lib/orm";
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
        orm
          .sequelize
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
            orm
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
        orm
          .sequelize
          .sync({
            force: true
          })
          .then(() => done());
      });
      it("should return 400", function(done) {
        const model = {
          username: "username",
          email: "username@domain.com",
          password: "password123"
        };
        orm
          .models
          .User
          .create(model)
          .then(function() {
            request(server.app)
              .post("/users")
              .send(model)
              .expect(400, done);
          });

      });
    });
  });

  after(() => server.server.close());
});

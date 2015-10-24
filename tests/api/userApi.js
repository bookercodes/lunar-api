import chai from "chai";
import request from "supertest";
import server from "../../";

const expect = chai.expect;

describe("user api", function() {
  describe("post", function() {
    describe("a valid model", function() {
      it("should return 200", function(done) {
        request(server)
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
    describe("an empty model", function() {
      it("should return 400", function(done) {
        request(server)
          .post("/users")
          .expect(400, done);
      });
    });
    describe("an invalid email", function() {
      it("should return 400 and email error", function(done) {
        request(server)
          .post("/users")
          .send({
            username: "username",
            email: "foo",
            password: "password123"
          })
          .expect(400)
          .expect('Content-Type', /json/)
          .end(function(err, res) {
            expect(res.body).to.have.length(1);
            expect(res.body[0].path).to.equal("body.email");
            done();
          });
      });
    });

    describe("an invalid username", function() {
      it("should return 400 and username error", function(done) {
        request(server)
          .post("/users")
          .send({
            username: "",
            email: "username@:domain.com",
            password: "password123"
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

    describe("an invalid password", function() {
      it("should return 400 and password error", function(done) {
        request(server)
          .post("/users")
          .send({
            username: "username",
            email: "username@:domain.com",
            password: ""
          })
          .expect(400)
          .expect('Content-Type', /json/)
          .end(function(err, res) {
            expect(res.body).to.have.length(1);
            expect(res.body[0].path).to.equal("body.password");
            done();
          });
      });
    });

  });
});

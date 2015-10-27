import chai from "chai";
import request from "supertest";
import server from "../../../";

const expect = chai.expect;

describe("/users api", function() {

  describe("create (post)", function() {

    describe("an empty model", function() {
      it("should return 400", function(done) {
        request(server)
          .post("/users")
          .expect(400, done);
      });
    });

    describe("a valid model", function() {
      it("should return 201", function(done) {
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

    describe("an erroneous  model", function() {
      it("should return 400", function() {
        request(server)
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
  });
});

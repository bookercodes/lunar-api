import chai from "chai";
import request from "supertest";
import server from "../"; 

const expect = chai.expect;

describe("join", function() {
  it ("should return 400 when no body is specified", function(done) {
    request(server)
      .post("/users")
      .expect(400, done);
  });

  it ("invalid email", function(done) {
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
 
  it ("invalid username", function(done) {
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

  it ("invalid password", function(done) {
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

  it("should return 200 when body is specified", function(done) {
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

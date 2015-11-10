import chai from "chai";
import db from "sequelize-context";
import server from "../../server.js";
import request from "supertest-as-promised";

const expect= chai.expect;

describe("post to '/users' route", function() {

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

});

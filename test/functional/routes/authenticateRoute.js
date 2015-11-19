import chai from "chai";
import config from "config";
// import db from "sequelize-context";
import server from "../../../server.js";
import request from "supertest-as-promised";

const expect = chai.expect;


suite("authenticate routes", function() {
  test("post with empty req body shold returns status code 400",
    function() {
      return request(server)
        .post("/login/")
        .expect(400);
    });

  test("post with invalid req body should return status code 400 and errors",
    function() {
      return request(server)
        .post("/login/")
        .send({
          username: "",
          password: ""
        })
        .then(function(res) {
          const expected = {
            message: "Validation failed",
            errors: [{
              path: "username",
              message: "\"username\" is not allowed to be empty"
            }, {
              path: "password",
              message: "\"password\" is not allowed to be empty"
            }]
          };
          expect(res.body)
            .to
            .eql(expected);
          expect(res.body.errors)
            .to
            .have
            .length(2);
        });
    });
});

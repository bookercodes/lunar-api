import chai from "chai";
import config from "config";
import server from "../../../server.js";
import request from "supertest-as-promised";
import db from "sequelize-context";

const expect = chai.expect;

suite("authenticate routes", function() {

  setup(function() {
    return db
      .connection
      .sync({
        force: true
      });
  });


  test("login with valid credentials returns 200", function() {
    const user = {
      username: "username",
      password: "password1",
      email: "username@domain.com"
    };
    return db
      .models
      .User
      .create(user)
      .then(function() {
        const supertest = request(server);
        return supertest
          .post("/login")
          .send({
            username: user.username,
            password: user.password
          })
          .then(function (res) {
            expect(res.status)
              .to
              .equal(200);
            expect(res.body.message).to.equal("Authenticated");
            expect(res.body.token).to.exist;
          });
      })
  });

  test("login after register with same credentials returns 200 and success message",
    function() {
      const user = {
        username: "username1",
        password: "passw0rd",
        email: "username@domain.com"
      };
      const supertest = request(server);
      return supertest
        .post("/users")
        .send(user)
        .then(function (res) {
          return supertest
            .post("/login")
            .send({
              username: user.username,
              password: user.password
            })
            .then(function (res) {
              expect(res.status)
                .to
                .equal(200);
              expect(res.body.message).to.equal("Authenticated");
            });
        });
    });

  test("post with invalid credentials should return status 200 and 'incorrect credentials' message",
    function() {
      return request(server)
        .post("/login/")
        .send({
          username: "username",
          password: "passw0rd"
        })
        .then(function(res) {
          expect(res.status)
            .to
            .equal(200);
          expect(res.body)
            .to
            .eql({
              message: "Invalid credentials",
              errors: [
                {
                  message: "Username or password is incorrect."
                }
              ]
            });
        });
    });

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


  test("post with one invalid field returns status code 400", function() {
    return request(server)
      .post("/login")
      .send({
        username: "",
        password: "some password",
      })
      .expect(400);
  });
});

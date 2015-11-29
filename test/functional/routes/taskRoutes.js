import db from "sequelize-context";
import config from "config";
import request from "supertest-as-promised";
import { expect } from "chai";
import server from "../../../server.js";

suite("task routes", function () {
  setup(function () {
    return db
      .connection
      .sync({
        force: true
      });
  });

  test("get with non-existent username should return status 404", function () {
    return request(server)
      .get("/users/1/tasks")
      .expect(404);
  });

  test("get with no auth token should return status 403", function () {
    return db
      .models
      .User
      .create({
        username: "username",
        email: "username@domain.com",
        password: "passw0rd"
      })
      .then(function(result) {
        var uid = result.dataValues.userId;
        return request(server)
          .get(`/users/${uid}/tasks`)
          .expect(403);
      });
  });

});

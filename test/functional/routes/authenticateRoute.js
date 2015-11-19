import chai from "chai";
import config from "config";
// import db from "sequelize-context";
import server from "../../../server.js";
import request from "supertest-as-promised";

const expect = chai.expect;


suite("authenticate routes", function() {
  test("post with empty req body shold returns tatus code 400",
    function() {
      return request(server)
        .post("/login/")
        .expect(400);
    });
});

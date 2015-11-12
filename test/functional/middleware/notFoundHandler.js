import chai from "chai";
import server from "../../../server.js";
import request from "supertest-as-promised";

const expect = chai.expect;

suite("notFoundHandler", function() {
  test("accessing un-defined route returns 404 response", function() {
    return request(server)
      .get("/this-route-does-not-exist")
      .expect(404);
  });

  test("accessing un-defined route returns not found message", function(
    ) {
    return request(server)
      .get("/this-route-does-not-exist")
      .then(function(res) {
        expect(res.body)
          .to
          .eql({
            message: "Not found"
          });
      });
  });
});

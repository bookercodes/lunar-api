import chai from "chai";
import server from "../../../server.js";
import request from "supertest-as-promised";

const expect = chai.expect;

suite("notFoundHandler", function() {
  test("request for non-existent route should return status code 404",
    function() {
      return request(server)
        .get("/this-route-does-not-exist")
        .expect(404);
    });

  test("request for non-existent route should return correct body",
    function() {
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

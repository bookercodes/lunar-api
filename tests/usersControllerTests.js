import { renderJoin } from "../controllers/usersController.js";
import { expect } from "chai";
import sinon from "sinon";

describe("usersController", function() {
  describe("renderJoinTemplate", function() {
    it("renders join template", function() {
      // setup
      let req;
      let res;
      let spy;
      req = res = {};
      spy = res.render = sinon.spy();
      
      // exercise
      renderJoin(req, res);
      
      // verify
      expect(spy.calledOnce).to.equal(true);
      expect(spy.calledWith('join')).to.equal(true);
    });
  });
});

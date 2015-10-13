import {renderHomePage} from "../controllers/homeController.js";
import { expect } from "chai";
import sinon from "sinon";

describe("homeController", function() {
  describe("renderHomePage", function() {
    it("renders home page", function() {
      // setup
      let req;
      let res;
      let spy;
      req = res = {};
      spy = res.render = sinon.spy();
      
      // exercise
      renderHomePage(req, res);
      
      // verify
      expect(spy.calledOnce).to.equal(true);
      expect(spy.calledWith('home')).to.equal(true);
    });
  });
});

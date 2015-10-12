import { expect } from "chai";
import orm from '../lib/orm';

describe("a valid model", function(done) {
  before(function(done) {
    orm.discover = [__dirname + '/../models/'];
    orm.connect("lunar_schema", "root", "");
    orm.sequelize.sync({
      force: true
    }).then(function() {
      done();
    });
  });

  it("returns userId", function() {
    return orm.models.User.create({
      username: "username",
      email: "email@email.com",
      password: "password"
    }).then(function(user) {
      expect(user.dataValues.userId).to.exist;
    });
  });
});

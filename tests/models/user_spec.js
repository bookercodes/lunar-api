import chai from "chai";
import chaiStr from 'chai-string';
import orm from '../../lib/orm';
import config from "config";

chai.use(chaiStr);
const expect = chai.expect;

describe("user", function() {
  before(function(done) {
    orm.logger = false;
    orm.discover = [__dirname + '/../../models/'];
    orm.connect(config.db.name, config.db.user, config.db.pass, {
      logging: false,
      dialect: config.db.dialect
    });
    orm
      .sequelize
      .sync({
        force: true
      }).then(function() {
        done();
      });
  });

  describe("a valid model", function(done) {

    let createResult;

    const user = {
      username: "username",
      email: "email@email.com",
      password: "password"
    };

    before(function(done) {
      orm
        .models
        .User
        .create(user)
        .then(function(result) {
          createResult = result;
          done();
        });
    });

    it("returns userId", function() {
      expect(createResult.dataValues.userId).to.exist;
    });

    it("does not store the password in plaintext", function() {
      expect(createResult.dataValues.password).to.not.equal(user.password);
    });

    it("hashes the password using bcrypt", function() {
      expect(createResult.dataValues.password).to.startsWith('$2a$');
    });
  });
});

import chai from "chai";
import chaiStr from 'chai-string';
import dbContext from 'sequelize-context';
import config from "config";

chai.use(chaiStr);
const expect = chai.expect;

describe("user", function() {
  before(function(done) {
    dbContext.connect(config.database, config.username, config.password, {
      logging: false,
      dialect: config.dialect
    });
    dbContext
      .connection
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
      dbContext
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

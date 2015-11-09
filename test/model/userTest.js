import chai from "chai";
import chaiStr from 'chai-string';
import db from 'sequelize-context';
import config from "config";

chai.use(chaiStr);
const expect = chai.expect;

before(function() {});

describe("create with valid model", function(done) {

  let createResult;

  const user = {
    username: "username",
    email: "email@email.com",
    password: "password"
  };

  before(function(done) {
    db.connect(config.database, config.username, config.password, {
      logging: false,
      dialect: config.dialect
    });
    db
      .connection
      .sync({
        force: true
      }).then(function() {
        db
          .models
          .User
          .create(user)
          .then(function(result) {
            createResult = result;
            done();
          });
      });
  });

  it("should return userId", function() {
    expect(createResult.dataValues.userId).to.exist;
  });

  it("should not store the password in plain text", function() {
    expect(createResult.dataValues.password).to.not.equal(user.password);
  });

  it("should hash the password using bcrypt", function() {
    expect(createResult.dataValues.password).to.startsWith('$2a$');
  });
});

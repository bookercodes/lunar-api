import chai from "chai";
import chaiStr from 'chai-string';
import db from 'sequelize-context';
import config from "config";

chai.use(chaiStr);
const expect = chai.expect;

before(function() {
  db.connect(config.database, config.username, config.password, {
    logging: false,
    dialect: config.dialect
  });
  return db
    .connection
    .sync({
      force: true
    });
});

describe("create with valid model", function(done) {

  let createResult;

  const user = {
    username: "username",
    email: "email@email.com",
    password: "password"
  };

  before(function() {
    return db
      .models
      .User
      .create(user)
      .then(function(result) {
        createResult = result;
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

import chai from "chai";
import chaiStr from "chai-string";
import chaiAsPromised from "chai-as-promised";
import db from "sequelize-context";
import config from "config";

chai.use(chaiStr);
chai.use(chaiAsPromised);
const expect = chai.expect;

suite("userModel", function() {

  suiteSetup(function() {
    db.connect(config.database, config.username, config.password, {
      logging: false,
      dialect: config.dialect
    });
  });

  setup(function() {
    return db
      .connection
      .sync({
        force: true
      });
  });

  test(
    "validateAvailability() with unavailable field should return an error",
    function() {
      const user = {
        username: "username",
        email: "email@email.com",
        password: "password"
      };
      const promise = db
        .models
        .User
        .create(user)
        .then(function() {
          return db
            .models
            .User
            .validateAvailability("username", user.username);
        });
      return expect(promise)
        .to
        .eventually
        .have
        .length(1);
    });

  test(
    "validateAvailability() with available field should return empty array",
    function() {
      const promise = db
        .models
        .User
        .validateAvailability("username", "foo");
      return expect(promise)
        .to
        .eventually
        .have
        .length(0);
    });


  const user = {
    username: "username",
    email: "email@email.com",
    password: "password"
  };

  test("create() returns userId", function(done) {
    db
      .models
      .User
      .create(user)
      .then(function(result) {
        expect(result.dataValues.userId)
          .to
          .exist;
        done();
      });
  });


  test("create() does not store password in plaintext", function(done) {
    db
      .models
      .User
      .create(user)
      .then(function(result) {
        expect(result.dataValues.password)
          .to
          .not
          .equal(user.password);
        done();
      });
  });

  test("create() hashes the password using bcrypt", function(done) {
    db
      .models
      .User
      .create(user)
      .then(function(result) {
        expect(result.dataValues.password)
          .to
          .startWith("$2a$");
        done();
      });
  });
});

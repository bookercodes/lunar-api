import chai from "chai";
import chaiStr from 'chai-string';
import orm from '../lib/orm';

chai.use(chaiStr);
const expect = chai.expect;

describe("user", function() {

  before(function(done) {
    orm.logger = false;
    orm.discover = [__dirname + '/../models/'];
    orm.connect("lunar_schema", "root", "", {
      logging: false
    });
    orm.sequelize.sync({
      force: true
    }).then(function() {
      done();
    });
  });
  
  describe("a null password", function(done) {
    it("is not successful", function(done) {
      orm
        .models
        .User
        .create({
          username: "user",
          email: "foo@foo.com",
          password: null
        })
        .then(function() {
          expect.fail();
          done();
        })
        .catch(orm.Sequelize.ValidationError, function() {
          expect("everthing").to.be.ok;
          done();
        });
    });
  });

  describe("an empty password", function(done) {
    it("is not successful", function(done) {
      orm
        .models
        .User
        .create({
          username: "user",
          email: "foo@foo.com",
          password: ""
        })
        .then(function() {
          expect.fail();
          done();
        })
        .catch(orm.Sequelize.ValidationError, function() {
          expect("everthing").to.be.ok;
          done();
        });
    });
  });
  describe("a null username", function(done) {
    it("is not successful", function(done) {
      orm
        .models
        .User
        .create({
          username: null,
          email: "foo@foo.com",
          password: "password"
        })
        .then(function() {
          expect.fail();
          done();
        })
        .catch(orm.Sequelize.ValidationError, function() {
          expect("everthing").to.be.ok;
          done();
        });
    });
  });

  describe("an empty username", function(done) {
    it("is not successful", function(done) {
      orm
        .models
        .User
        .create({
          username: "",
          email: "email@email.com",
          password: "password"
        })
        .then(function() {
          expect.fail();
          done();
        })
        .catch(orm.Sequelize.ValidationError, function() {
          expect("everthing").to.be.ok;
          done();
        });
    });
  });

  describe("a null email", function(done) {
    it("is not successful", function(done) {
      orm
        .models
        .User
        .create({
          username: "username",
          email: null,
          password: "password"
        })
        .then(function() {
          expect.fail();
          done();
        })
        .catch(orm.Sequelize.ValidationError, function() {
          expect("everthing").to.be.ok;
          done();
        });
    });
  });

  describe("an invalid email", function(done) {
    it("is not successful", function(done) {
      orm
        .models
        .User
        .create({
          username: "username",
          email: "email",
          password: "password"
        })
        .then(function() {
          expect.fail();
          done();
        })
        .catch(orm.Sequelize.ValidationError, function() {
          expect("everthing").to.be.ok;
          done();
        });
    });
  });

  describe("an empty email", function(done) {
    it("is not successful", function(done) {
      orm
        .models
        .User
        .create({
          username: "username",
          email: "",
          password: "password"
        })
        .then(function() {
          expect.fail();
          done();
        })
        .catch(orm.Sequelize.ValidationError, function() {
          expect("everthing").to.be.ok;
          done();
        });
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

    it("is stored in the db", function() {
      orm
        .models
        .User
        .findById(createResult.userId)
        .then(function(user) {
          expect(user).to.exist;
        });
    });
  });
});

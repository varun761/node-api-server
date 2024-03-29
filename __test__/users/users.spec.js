const chai = require('chai');
const chaiHttp = require('chai-http');
const { faker } = require('@faker-js/faker');

const app = require('../../index');
const { userModel } = require('../../database/models');

const { assert } = chai;

chai.use(chaiHttp);

const containsFullName = {
  name: faker.name.fullName(),
  email: faker.internet.email(),
  dob: '1992-01-01',
  password: faker.internet.password(),
};

const onlyFirstNameCredentials = {
  name: faker.name.firstName(),
  email: faker.internet.email(),
  dob: '1992-01-01',
  password: faker.internet.password(),
};

describe('POST /v1/user/', () => {
  after((done) => {
    // user collection cleanup
    userModel
      .deleteMany({
        email: {
          $in: [containsFullName.email, onlyFirstNameCredentials.email],
        },
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => done());
  });

  it('containsFullName: should return 201 response with message', (done) => {
    chai
      .request(app)
      .post('/v1/user/')
      .send(containsFullName)
      .end((err, response) => {
        response.should.have.status(201);
        response.body.should.have.keys('message');
        response.body.message.should.be.a('string');
        assert.equal(response.body.message, 'User created successfully');
        done();
      });
  });

  it('onlyFirstNameCredentials: should return 201 response with message', (done) => {
    chai
      .request(app)
      .post('/v1/user/')
      .send(onlyFirstNameCredentials)
      .end((err, response) => {
        response.should.have.status(201);
        response.body.should.have.keys('message');
        response.body.message.should.be.a('string');
        assert.equal(response.body.message, 'User created successfully');
        done();
      });
  });
});

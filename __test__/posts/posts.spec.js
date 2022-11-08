const app = require("../../index");
const chai = require("chai");
const chaiHttp = require("chai-http");
const should = chai.should();

chai.use(chaiHttp);

describe("GET /v1/post/", () => {
  it('should return all the posts', (done) => {
    chai
      .request(app)
      .get("/v1/post/")
      .end((err, response) => {
        response.should.have.status(200);
        response.body.should.have.keys("posts", "total");
        response.body.posts.should.be.a("array");
        response.body.total.should.be.a("number");
        done();
      });
  });
});

describe("POST /v1/post/", () => {
  it("should posts data to api and return 201 response", (done) => {
    done();
  });
});

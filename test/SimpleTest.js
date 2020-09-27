const request = require('supertest');
/* const should = */ require('should');
const app = require('../app.js');

describe('GET /', () => {
  it('respond with hello world', (done) => {
    // navigate to root and check the the response
    request(app).get('/').end((err, res) => {
      res.text.should.match(/Turbo Waffle/);
      done();
    });
  });
});

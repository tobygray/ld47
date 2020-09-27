var request = require('supertest');
var app = require('../app.js');
var should = require('should');

describe('GET /', function() {
 it('respond with hello world', function(done) {
 //navigate to root and check the the response
 request(app).get('/').end(function(err, res) {
	 res.text.should.match(/Turbo Waffle/);
	 done();
   });
 });
});

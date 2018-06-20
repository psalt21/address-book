//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let Address = require('../models/address');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();

chai.use(chaiHttp);
//Our parent block
describe('Addresses', () => {
/*
  * Test the /GET route
  */
  describe('/GET addresses', () => {
      it('it should GET all the addresses', (done) => {
        chai.request(server)
            .get('/catalog/addresses')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.length;
              done();
            });
      });
  });

});
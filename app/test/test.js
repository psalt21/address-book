//During the test the env variable is set to test
//process.env.NODE_ENV = 'test';

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
    
   /*
  * Test the /Get create address form
  */
  describe('/GET create address form', () => {
      it('it should pull up the create address form', (done) => {
        chai.request(server)
            .get('/catalog/address/create')
            .end((err, res) => {
                res.should.have.status(200);
              done();
            });
      });

  }); 

});

/*
 * Test getting an existing address
 */
    describe('/GET specific existing address', () => {
       it('it shoulld GET the address with id \'5b25c999ff59ab00b804a5f9\'', (done) => {
         chai.request(server)
            .get('/catalog/address/5b25c999ff59ab00b804a5f9')
            .end((err, res) => {
                res.should.have.status(200);
                done();
          });
       });
    });
//During the test the env variable is set to test
//process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let Address = require('../models/address');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();
let currentAddressId = null;

chai.use(chaiHttp);
//Our parent block
describe('Addresses', () => {
/*
  * Test the /GET route (READING)
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
    /*
     * Test CREATING and then getting (READING) the new address
     */
    describe('create and then /GET/:id address', () => {
      it('it should create a new address and then GET it by id', (done) => {
        let address = new Address({ first_name: "testFirstNameUnique1", last_name: "testLastNameUnique1", address: "testAddressUnique1" });
        address.save((err, address) => {
            // save current address.id to global variable to use in other test
            currentAddressId = address.id;
            chai.request(server)
            .get('/catalog/address/' + address.id)
            .send(address)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
              done();
            });
        });

      });
  }); 
    /*
     * Test UPDATING address created in previous test
     */
    describe('/post/catalog/address/:id/update', () => {
        it('it should UPDATE an address by the given id', (done) => {
           chai.request(server)
            .post('/catalog/address/' + currentAddressId + '/update')
            .send({first_name: "updatedTestFirstName", last_name: "updatedTestLastName", address: "updatedTestAddress"})
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
               done();
            });
        });
    });
//    /*
//     * Test DELETING address created in previous test
//     */
//    describe('/post/catalog/address/:id/delete', () => {
//        it('it should DELETE an address by the given id', (done) => {
//           chai.request(server)
//            .post('/catalog/address/' + currentAddressId + '/delete')
//            .end((err, res) => {
//                res.should.have.status(200);
//                res.body.should.be.a('object');
//               done();
//            });
//        });
//    });
    
});

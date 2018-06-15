#! /usr/bin/env node

console.log('This script populates some test addresses. Specified database as argument - e.g.: populatedb mongodb://<dbuser>:<dbpassword>@ds259820.mlab.com:59820/address_book');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
if (!userArgs[0].startsWith('mongodb://')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}

var async = require('async')
var Address = require('./models/address')


var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

var addresses = []

function addressCreate(first_name, last_name, address, cb) {
  addressdetail = {first_name: first_name , last_name: last_name, address: address }
  
  var addresss = new Address(addressdetail);
       
  address.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Address: ' + address);
    address.push(address)
    cb(null, address)
  }  );
}

// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('ADDRESSInstances: ');
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});




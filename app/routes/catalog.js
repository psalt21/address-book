var express = require('express');
var router = express.Router();

// Require controller modules.
var address_controller = require('../controllers/addressController');

/// ADDRESS ROUTES ///

// GET catalog home page.
//router.get('/', address_controller.index);  //This actually maps to /catalog/ because we import the route with a /catalog prefix

// GET request for creating Address. NOTE This must come before route for id (i.e. display address).
router.get('/address/create', address_controller.address_create_get);

// POST request for creating Address.
router.post('/address/create', address_controller.address_create_post);

// GET request to delete Address.
router.get('/address/:id/delete', address_controller.address_delete_get);

// POST request to delete Address.
router.post('/address/:id/delete', address_controller.address_delete_post);

// GET request to update Address.
router.get('/address/:id/update', address_controller.address_update_get);

// POST request to update Address.
router.post('/address/:id/update', address_controller.address_update_post);

// GET request for one Address.
router.get('/address/:id', address_controller.address_detail);

// GET request for list of all Addresses.
router.get('/addresss', address_controller.address_list);

module.exports = router;
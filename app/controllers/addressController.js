const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
var Address = require('../models/address');

var async = require('async');

exports.index = function(req, res) {   
    
    async.parallel({
        address_count: function(callback) {
            Address.count({}, callback);
        },
    }, function(err, results) {
        res.render('index', { title: 'Address Book Home', error: err, data: results });
    });
};

// Display list of all Addresses passed in.
exports.address_list = function(req, res, next) {
    Address.find({}, '')
    .populate('addresses')
    .exec(function (err, list_addresses) {
      if (err) { return next(err); }
      //Successful, so render
      res.render('address_list', { title: 'Address List', address_list: list_addresses });
    });
};

// Display detail page for a specific Address.
exports.address_detail = function(req, res, next) {
    Address.find({_id:req.params.id}, '')
    .populate('addresses')
    .exec(function (err, list_addresses) {
      if (err) { return next(err); }
      //Successful, so render
      res.render('address_list', { title: 'Address Info', address_list: list_addresses });
    });
};

// Display Address create form on GET.
exports.address_create_get = function(req, res, next) {       
    res.render('address_form', { title: 'Create Address'});
};

// Handle Address create on POST.
exports.address_create_post = [

    // Validate fields.
    body('first_name').isLength({ min: 1 }).trim().withMessage('First name must be specified.')
        .isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),
    body('last_name').isLength({ min: 1 }).trim().withMessage('Last name must be specified.')
        .isAlphanumeric().withMessage('Last name has non-alphanumeric characters.'),
    body('address').isLength({ min: 1 }).trim().withMessage('Address must be specified.'),
    
    // Sanitize fields.
    sanitizeBody('first_name').trim().escape(),
    sanitizeBody('last_name').trim().escape(),
    sanitizeBody('address').trim().escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('address_form', { title: 'Create Address', address: req.body, errors: errors.array() });
            return;
        }
        else {
            // Data from form is valid.

            // Create an Author object with escaped and trimmed data.
            var address = new Address(
                {
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    address: req.body.address
                    
                });
            address.save(function (err) {
                if (err) { return next(err); }
                // Successful - redirect to new address record.
                res.redirect(address.url);
            });
        }
    }
];

// Display Address delete form on GET.
exports.address_delete_get = function(req, res, next) {
    async.parallel({
        address: function(callback) {
            Address.findById(req.params.id).exec(callback)
        }
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.address==null) { // No results.
            res.redirect('/catalog/addresses');
        }
        // Successful, so render.
        res.render('address_delete', { title: 'Delete Address', address: results.address } );
    });
};

// Handle Address delete on POST.
exports.address_delete_post = function(req, res, next) {
    async.parallel({
        address: function(callback) {
          Address.findById(req.body.addressid).exec(callback)
        },
    }, function(err, results) {
        if (err) { return next(err); }
        // Success
            // Delete address object
            Address.findByIdAndRemove(req.body.addressid, function deleteAddress(err) {
                if (err) { return next(err); }
                // Success - go to address list
                res.redirect('/catalog/addresses')
            })
    });
};

// Display Address update form on GET.
exports.address_update_get = function(req, res, next) {
    // Get first_name, last_name and address for form.
    async.parallel({
        address: function(callback) {
          Address.find({_id:req.params.id}, '').populate('addresses').exec(callback);  
        },
        }, function(err, results) {
            if (err) { return next(err); }
            // Success.
            res.render('update_form', { title: 'Update Address', address:results.address[0] });
        });
};

// Handle Address update on POST.
exports.address_update_post = [
    
    (req, res, next) => {
        next();
    },
   
    // Validate fields.
    body('first_name', 'First name must not be empty.').isLength({ min: 1 }).trim(),
    body('last_name', 'Last name must not be empty.').isLength({ min: 1 }).trim(),
    body('address', 'Address must not be empty.').isLength({ min: 1 }).trim(),

    // Sanitize fields.
    sanitizeBody('first_name').trim().escape(),
    sanitizeBody('last_name').trim().escape(),
    sanitizeBody('address').trim().escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create an Address object with escaped/trimmed data and old id.
        var address = new Address(
          { first_name: req.body.first_name,
            last_name: req.body.last_name,
            address: req.body.address,
            _id:req.params.id //This is required, or a new ID will be assigned!
           });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.

            // Get all adresses form.
            async.parallel({
                addresses: function(callback) {
                    Address.find(callback);
                },
            }, function(err, results) {
                if (err) { return next(err); }

                res.render('update_form', { title: 'Update Address',addresses:results.addresses, address: address, errors: errors.array() });
            });
            return;
        }
        else {
            // Data from form is valid. Update the record.
            Address.findByIdAndUpdate(req.params.id, address, {}, function (err,theaddress) {
                if (err) { return next(err); }
                   // Successful - redirect to address detail page.
                   res.redirect(theaddress.url);
                });
        }
    }
];
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

// Display list of all Addresses.
exports.address_list = function(req, res, next) {
    Address.find({}, 'address first_name last_name')
    .populate('addresses')
    .exec(function (err, list_addresses) {
      if (err) { return next(err); }
      //Successful, so render
      res.render('address_list', { title: 'Address List', address_list: list_addresses });
    });
};

// Display detail page for a specific Address.
exports.address_detail = function(req, res, next) {
    Address.find({}, req.params.id)
    .populate('address')
    .exec(function (err, detail_address) {
        if (err) { return next(err);}
        // Successful, so render
        res.render(address_detail, {title: 'Address Detail', address_detail: detail_address});
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
exports.address_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Address delete GET');
};

// Handle Address delete on POST.
exports.address_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Address delete POST');
};

// Display Address update form on GET.
exports.address_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Address update GET');
};

// Handle Address update on POST.
exports.address_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Address update POST');
};
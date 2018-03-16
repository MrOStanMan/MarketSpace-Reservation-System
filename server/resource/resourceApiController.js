'use strict';

//========================================================================================
//========================================================================================
// NOTE The method names in a *ApiController
// must be exactly as defined in /server/api/api.routes.js
// You DO NOT have to implement all the methods
// but those that you do must have the exact names and
// argument lists
//========================================================================================
//========================================================================================

var ResourceService = require('./resourceService.js');

//========================================================
// create
//========================================================
exports.create = function(req, res) {
    console.log('+ resourceApiController.create');
    var service = new ResourceService();

    //calls create method in resourceService class
    service.create(req, res, req.body, function(err, result){
        if (err || !result) {
            res.status(500).json({});
        } else {
            res.status(200).json(result);
        }
    });
}

//========================================================
// findAll
//========================================================
exports.findAll = function(req, res) {
    console.log('+ resourceApiController.findAll');

    var service = new ResourceService();
    /*
service.findByUser(req, res, req.user.userNumber, function(err, result){
    if (err || !result) {
        res.status(500).json({});
    } else {
        res.status(200).json(result);
    }
});
*/
    service.findByCriteria(req, res, {}, function(err, result){
        if (err || !result) {
            res.status(500).json({});
        } else {
            res.status(200).json(result);
        }
    });

}



//create service called findByUpComing..

//========================================================
// findOne
//========================================================
exports.findOne = function(req, res) {
    console.log('+ resourceApiController.findOne');

    var service = new ResourceService();
    service.findByCriteria(req, res, {}, function(err, result){
        if (err || !result) {
            res.status(500).json({});
        } else {
            res.status(200).json(result);
        }
    });
}



//========================================================
// findByCriteria
//========================================================
exports.findByCriteria = function(req, res, criteria) {
    console.log('+ resourceApiController.findByCriteria');
    console.log('++ criteria: ' + JSON.stringify(criteria));
    var service = new ResourceService();
    /*
    //This condtion would call a service method specific to the needs of the query
    res.status(200).json({
        title: 'findByCriteria',
        theParameter: criteria['theParameter'],
    });
    */

    //pass req.query. expressjs
    service.findByCriteria(req, res, criteria, function(err, result){
        if (err || !result) {
            res.status(500).json({});
        } else {
            res.status(200).json(result);
        }
    });
}

//========================================================
// update
//========================================================
exports.update = function(req, res) {
    console.log('+ resourceApiController.update');

    var service = new ResourceService();
    service.update(req, res, parseInt(req.params.entityNumber), req.body, function(err, result){
        if (err || !result) {
            res.status(500).json({});
        } else {
            res.status(200).json(result);
        }
    });
}

//========================================================
// delete
//========================================================
exports.delete = function(req, res) {
    console.log('+ resourceApiController.delete');

    var service = new ResourceService();
    service.delete(req, res, parseInt(req.params.entityNumber), function(err){
        if (err) {
            res.status(500).json({});
        } else {
            res.status(200).json({});
        }
    });
}

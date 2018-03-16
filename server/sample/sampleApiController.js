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

var SampleService = require('./sampleService.js');

//========================================================
// create
//========================================================
exports.create = function(req, res) {
	console.log('+ sampleApiController.create');
	var service = new SampleService();

	//calls create method in sampleService class
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
	console.log('+ sampleApiController.findAll');

	var service = new SampleService();
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

//========================================================
// findOne
//========================================================
exports.findOne = function(req, res) {
    console.log('+ sampleApiController.findOne');

    var service = new SampleService();
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
	console.log('+ sampleApiController.findByCriteria');
	console.log('++ criteria: ' + JSON.stringify(criteria));
    var service = new SampleService();
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
	console.log('+ sampleApiController.update');

	var service = new SampleService();
	service.update(req, res, parseInt(req.params.entityNumber), req.body, function(err, result){
		console.log("printing body" + JSON.stringify(result));
		if (err || !result) {
			console.log(err + "ERROR HERE");
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
	console.log('+ sampleApiController.delete');

	var service = new SampleService();

	service.delete(req, res, parseInt(req.params.entityNumber), function(err){

		if (err) {
			res.status(500).json({});
		} else {
			res.status(200).json({});
		}
	});
}


//create service called findByUpComing..
//========================================================
// findByUpcoming
//========================================================
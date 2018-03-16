'use strict';

//========================================================
// Generic routes for API V1
//  Handles the following routes:
//     
//       TBD
//
//  Controller must be named:
//
//       entityApiController.js
//
//  Controller methods must be named as follows.
//  Not all names are required
//  Only implement the methods needed
//    
//       create
//       findAll
//       findByCriteria
//       findOne
//       update
//       delete
//
//  All parameters are passed in req.body
//========================================================
module.exports = function(app) {
	var ensure = require('../middleware/ensure.middleware.js');

	//========================================================
	// REST
	//========================================================

	//========================================================
	// Create - POST /api/v1/entity
	//========================================================
	app.post('/api/v1/:entityName', function(req, res, next) {
		if (req.params.entityName.toLowerCase() === 'cartitem') {//Allow some entities to be created as anonymous
			next();
		} else {
			ensure.authenticated(req, res, next);
		}
	}, ensure.userSettings, function(req, res, next) {
		console.log('+4');
		console.log('+ apiRoutes.post(%s)', req.params.entityName);
		try {

			//Require the controller. /sample/sampleApiController.js
			var controller = require('../' + req.params.entityName + '/' + req.params.entityName + 'ApiController.js');

			//Call the method
			if (controller && controller['create']) { //if controller exists and has create method
				controller.create(req, res, next); //goes to sampleApiController and calls create
			} else {
				console.log("++ Method create not found");
				res.status(404).send({});
			}

		} catch (ex) {
			console.log("++ ex: %s", ex);
			res.status(404).send({});
		}
	});

	//========================================================
	// Read - GET (List) /api/v1/entity
	//========================================================
	app.get('/api/v1/:entityName', function(req, res, next) {

		console.log('+ apiRoutes.get(%s)', req.params.entityName);
		try {
			var thePath = '../' + req.params.entityName + '/' + req.params.entityName + 'ApiController.js';
			var controller = require(thePath);
			
			if (controller) {

				//If no query string is given, get all the  items
				if ((!req.query || Object.keys(req.query).length <= 0) && controller['findAll']) {
					controller.findAll(req, res, next);		//Call the method

				//If query string params are given, get the items matching those criteria
				} else if (req.query && Object.keys(req.query).length > 0 && controller['findByCriteria']) {
					controller.findByCriteria(req, res, req.query, next); //method returns a query string

				} else {
					console.log("++ Method findAll or findByCriteria not found or missing parameters");
					res.status(404).send({});
				}
			} else {
				console.log("++ Controller not found");
				res.status(404).send({});
			}

		} catch (ex) {
			console.log('++ ex: %s', ex);
			console.log('++ ex: ' + JSON.stringify(ex, null, 4));
			res.status(404).send({});
		}
	});

	//========================================================
	// Read - GET (Single) /api/v1/entity/entityNumber
	//========================================================
	app.get('/api/v1/:entityName/:entityNumber', function(req, res, next) {

		console.log('+ apiRoutes.get(%s, %s)', req.params.entityName, req.params.entityNumber);
		try {
			var controller = require('../' + req.params.entityName + '/' + req.params.entityName + 'ApiController.js');
			if (controller && controller['findOne']) {
				controller.findOne(req, res, req.params.entityNumber, next);		//Call the method
			} else {
				console.log("++ Method findOne not found");
				res.status(404).send({});
			}

		} catch (ex) {
			console.log("++ ex: %s", ex);
			res.status(404).send({});
		}
	});

	//========================================================
	// Update - PUT /api/v1/entity/entityNumber
	//========================================================
	// app.put('/api/v1/sample/:entityNumber', function(req, res, next) {
    //
	// 	//Order API Controller can be updated by anonymous users
	// 	console.log('+ apiRoutes.put(%s, %s)', 'order', req.params.entityNumber);
	// 	try {
    //
	// 		//Require the controller.
	// 		var controller = require('../order/orderApiController.js');
    //
	// 		//Call the method
	// 		if (controller && controller['update']) {
	// 			controller.update(req, res, next);
	// 		} else {
	// 			console.log("++ Method update not found");
	// 			res.status(404).send({});
	// 		}
    //
	// 	} catch (ex) {
	// 		console.log("++ ex: %s", ex);
	// 		res.status(404).send({});
	// 	}
	// });

	app.put('/api/v1/:entityName/:entityNumber', function(req, res, next) {

		console.log('+ apiRoutes.put(%s, %s)', req.params.entityName, req.params.entityNumber);
		try {

			//Require the controller.
			var controller = require('../' + req.params.entityName + '/' + req.params.entityName + 'ApiController.js');

			//Call the method
			if (controller && controller['update']) {
				controller.update(req, res, next);
			} else {
				console.log("++ Method update not found");
				res.status(404).send({});
			}

		} catch (ex) {
			console.log("++ ex: %s", ex);
			res.status(404).send({});
		}
	});

	//========================================================
	// Delete - DELETE /api/v1/entity/entityNumber
	//========================================================
	app.delete('/api/v1/:entityName/:entityNumber', ensure.authenticated, ensure.userSettings, function(req, res, next) {
	// app.delete('/api/v1/:entityName/:entityNumber', ensure.authenticated, ensure.userSettings, function(req, res, next) {

		console.log('+ apiRoutes.delete(%s, %s)', req.params.entityName, req.params.entityNumber);
		try {
			//Require the controller. original
			var controller = require('../' + req.params.entityName + '/' + req.params.entityName + 'ApiController.js');

			//Call the method
			if (controller && controller['delete']) {
				controller.delete(req, res, next);
			} else {
				console.log("++ Method delete not found");
				res.status(404).send({});
			}

		} catch (ex) {
			console.log("++ ex: %s", ex);
			res.status(404).send({});
		}
	});

	//========================================================
	// Delete - DELETE (all)
	//========================================================
	app.delete('/api/v1/:entityName', ensure.authenticated, ensure.userSettings, function(req, res, next) {

		console.log('+ apiRoutes.deleteAll(%s, %s)', req.params.entityName, req.params.entityNumber);
		try {

			//Require the controller.
			var controller = require('../' + req.params.entityName + '/' + req.params.entityName + 'ApiController.js');

			//Call the method
			if (controller && controller['deleteAll']) {
				controller.deleteAll(req, res, next);
			} else {
				console.log("++ Method deleteAll not found");
				res.status(404).send({});
			}

		} catch (ex) {
			console.log("++ ex: %s", ex);
			res.status(404).send({});
		}
	});
}
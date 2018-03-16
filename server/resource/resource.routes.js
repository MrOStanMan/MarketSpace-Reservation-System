'use strict';
//var Resource = require('../models/data.js');
module.exports = function(app) {

	//GET list of resources
	app.get('/resource/:userNumber', function(req, res) {
		res.render('home/home.view.ejs', {
			user: req.user,
			title: 'resource 987'
		});
	});
};

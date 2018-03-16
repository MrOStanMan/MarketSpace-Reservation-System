module.exports = function(app) {
	app.use(function(req, res, next) {

		if (req.session && req.session.user) {
			req.user = req.session.user;
		} else {
			req.user = {
				userNumber: 111,
				displayName: 'Charlie Customer',
				role: 'customer',
			}
			req.session.user = req.user;
		}
		next();
	});

	//========================================================
	// Customer
	//========================================================
	app.get('/user/become-customer/:userNumber',function(req, res) {
		req.user = {
			userNumber: parseInt(req.params.userNumber),
			displayName: 'Customer ' + parseInt(req.params.userNumber),
			role: 'customer',
			isCustomer: true
		}
		req.session.user = req.user;
		res.redirect('back');
	});

	//========================================================
	// Seller
	//========================================================
	app.get('/user/become-seller/:userNumber', function(req, res) {
		req.user = {
			userNumber: parseInt(req.params.userNumber),
			displayName: 'Seller '+ parseInt(req.params.userNumber),
			role: 'seller',
			isSeller: true
		}
		req.session.user = req.user;
		res.redirect('back');
	});

	//========================================================
	// Marketplace Owner
	//========================================================
	app.get('/user/become-marketplace-owner', function(req, res) {
		req.user = {
			userNumber: 333,
			displayName: 'Michael Marketplace Owner',
			role: 'marketplace-owner',
		}
		req.session.user = req.user;
		res.redirect('back');
	});
}

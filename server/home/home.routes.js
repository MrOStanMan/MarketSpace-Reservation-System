
module.exports = function(app) {

	//GET Home
	app.get('/', function(req, res) {
		console.log('++ req.user: ' + JSON.stringify(req.user, null, 4));
		res.render('home/home.view.ejs', {
			user: req.user, title: 'MarketSpace Reservations'
		});
	});
};

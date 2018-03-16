'use strict';

//require() == import a module, after call module to instantiate it
var express = require('express');
var path = require('path'); //node module
var logger = require('morgan'); //middleware module
var cookieParser = require('cookie-parser'); //middleware module
var bodyParser = require('body-parser');//middleware module
var session = require('express-session');

//Project
var homeRoutes = require('./server/home/home.routes.js');
var ensure = require('./server/middleware/ensure.middleware.js');

//Database
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

var EXPRESS_SECRET = 'dfghnkuino-ertcarcec-tvutyibyuibytuv-sdvfkubyi-3456356-34563563546365356';

//========================
//
//========================
module.exports = function(connectedCallback){

	//Connect to database
	console.log('+ Connecting to MongoDB...');
	if (process.env.MONGODB_URI) {
		console.log('++ Using MONGODB_URI...');
		mongoose.connect(process.env.MONGODB_URI);	
	} else {
		console.log('++ Using localhost...');
		mongoose.connect('localhost', 'marketspace');

	}

	mongoose.connection.on('error', console.error.bind(console, 'Connection Error'));
	mongoose.connection.once('open', function callback() {

		//Connected
		console.log('++ Connected to DB');
		autoIncrement.initialize(mongoose.connection);

		//Add the routes
		var app = express();

		// view engine setup
		app.set('views', path.join(__dirname, 'server'));
		app.set('view engine', 'ejs');
		app.engine('ejs', require('ejs-locals'));

		//Middleware
		app.use(logger('dev'));
		app.use(bodyParser.json());
		app.use(bodyParser.urlencoded({ extended: false }));
		app.use(cookieParser());

		//Static files
		var staticMaxAge = 31557600000; //one year
		app.use(express.static(path.join(__dirname, 'public'), { maxAge: staticMaxAge }));
		app.use('/client', express.static(path.join(__dirname, 'client'), { maxAge: staticMaxAge })); 

		//Session
		console.log('++ Configuring Session ');
		app.use(
			session({
				cookie: { 
					maxAge : 1200000,			//in milliseconds: 1200000 = 20 * 60 * 1000
				//	httpOnly: false,
				//	secure: true, 
				},		
				resave: false,					//Don't save the session to store if it hasn't changed
				rolling: true,					//Reset the cookie Max-Age on every request
				saveUninitialized: false,		//Don't create a session for anonymous users
				secret: EXPRESS_SECRET,
				// store: new MongoStore({ mongooseConnection: mongooseConnection })
			})
		);


		//Get a fake user
		require(path.resolve('./server/user/user.routes.js'))(app);

		//API
		app.all('/api/*', ensure.noCache);
		require(path.resolve('./server/api/api.routes.js'))(app);

		//------------------------------------------------------
		// All of the non-api server side routes 
		//------------------------------------------------------
		require(path.resolve('./server/home/home.routes.js'))(app);
		require(path.resolve('./server/resource/resource.routes.js'))(app);

		// catch 404 and forward to error handler
		app.use(function(req, res, next) {
		  var err = new Error('Not Found');
		  err.status = 404;
		  next(err);
		});

		// error handler
		app.use(function(err, req, res, next) {
		  // set locals, only providing error in development
		  res.locals.message = err.message;
		  res.locals.error = req.app.get('env') === 'development' ? err : {};

		  // render the error page
		  res.status(err.status || 500);
		  res.render('error/error');
		});
		//Call callback to indicate DB is connected 
		console.log('++ app-marketplace.js - DB is connected. Calling connected callback');
		connectedCallback(app); //recursive call
	});
}

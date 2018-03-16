var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose.connection);

//============================
// HideLogging
//============================
exports.HideLogging = function(obj) {

	obj._logPlaceholder = console.log;
	obj._errorPlaceholder = console.error;
	console.log = function(value1, value2, value3, value4, value5){ };
	console.error = function(value1, value2, value3, value4, value5){ };
}

//============================
// ShowLogging
//============================
exports.ShowLogging = function(obj) {
	console.log = obj._logPlaceholder;
	console.error = obj._errorPlaceholder;
}


//Setup mongoose event handlers
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));

//============================
// OpenDb
//============================
exports.OpenDb = function (callback) {
	console.log('+ testHelper.OpenDb');
	if (mongoose.connection.db) {
		db = mongoose.connection;
		console.log('++ Connection already open');
		callback();
	} else {
		console.log('++ Connection not yet open. Opening...');
		mongoose.connection.once('open', function() {
			console.log('++ Connection.once called');
			callback();
		});
		db = mongoose.connect('localhost', 'marketspace');
        // db = mongoose.connect(process.env.MONGODB_URI);
	}
}
//============================
// CloseDb
//============================
exports.CloseDb = function(callback) {
	mongoose.connection.close(function() {
		mongoose.disconnect();
		db.disconnect();
		mongoose.connection.db = null;
		db = null;	
		//console.log("++ DB Connection closed");	//Comment because logging is turned on at this point
		callback();
	});
}

//============================
// GetReq
//============================
exports.GetReq = function() {
	var req = {
		user:{
			userNumber: 99,
		},
		body: {},
		session: {
			notificationCount: 0,
			save: function() {},
		},
		headers: {
			'x-forwarded-for': '127.0.0.1',
		},
		logIn: function(user, callback) { callback(null) },
		params: {},
		query: {},
		cookies: []
	}
	return req;
}

//============================
// GetRes
//============================
exports.GetRes = function() {
	var res = {
		locals: {
			language: 'en-ca',
		}
	}

	res.locals.__ = function(text) {
		return text;
	}

	res.status = function(code) {
		console.log("++ res.status(%d)", code);
		this.statusResponse = code;
		return this;
	}

	res.render = function(viewName, model) {
		console.log('+ FAKE res.render(%s, %s)', viewName, JSON.stringify(model));
		var self = this;

		//Render
		var ejsLocalsRenderFile = require('ejs-locals');
		ejsLocalsRenderFile(__dirname + '/../server/' + viewName + '.ejs', options, function(err, rendered) {
			if (self.renderCallback && typeof self.renderCallback === 'function') {
				self.renderCallback(err, rendered);
			}
		});
	}

	res.cookies = [];	//Not a real ExpressJS field. Only used for accessing res cookies by test
	res.cookie = function(name, value, options) {
		res.cookies[name] = value;
	}

	//.end(), .send(), .json() are typically defined in the test

	return res;
}

//============================
// onUncaughtException
//============================
process.on('uncaughtException', function(err) {
	console.error(err.stack);
});


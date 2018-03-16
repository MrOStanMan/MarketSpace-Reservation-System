'use strict';

//========================================================
// authenticated
//========================================================
exports.authenticated = function(req, res, next) {
	next();
}

//========================================================
// userSettings
//========================================================
exports.userSettings = function(req, res, next) {
	next();
}

//========================================================
// ensure.noCache
//========================================================
exports.noCache = function(req, res, next) {
	res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
	res.header('Pragma', 'no-cache');
	res.header('Expires', 0);
	next();
}

//========================================================
// ensure.cacheForever
//========================================================
exports.cacheForever = function(req, res, next) {
	res.header('Cache-Control', 'max-age=31556926');
	next();
}
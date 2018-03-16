var helper = require('../../test/helper.js');
var SampleService = require('./sampleService.js');

exports['setUp'] = function(callback) {
	//helper.HideLogging(this); // if there is a problem with the test..comment this line out and line 10
	helper.OpenDb(callback);
}
  
exports['tearDown'] = function(callback) {
	//helper.ShowLogging(this); // if there is a problem with the test..comment this line out and line 10
	helper.CloseDb(callback);
}

//npm test command to run this file

//========================================================
// crud_normal_succeeds
//========================================================
exports.crud_normal_succeeds = function(test) {
	test.expect(12);
	var req = helper.GetReq(), res = helper.GetRes();
	var sampleService = new SampleService();

	//Create
	var sample = {
		title: 'Test Sample',
	}
	//testing create
	sampleService.create(req, res, sample, function(err, sample) {

		test.equal(null, err);
		test.ok(sample);
		test.equal('Test Sample', sample.title);

		//Read .. testing find method
		sampleService.findByUser(req, res, req.user.userNumber, function(err, samples) {

			test.equal(null, err);
			test.ok(samples);
			test.equal(1, samples.length);
			test.ok(samples[0]);
			test.equal('Test Sample', samples[0].title);

			//Update
			sample = {
				title: 'Test Sample Updated',
			}
			//testing update
			sampleService.update(req, res, samples[0].sampleNumber, sample, function(err, updatedSample) {

				test.equal(null, err);
				test.ok(updatedSample);
				test.equal('Test Sample Updated', updatedSample.title);

				//Delete ..testing delete
				sampleService.delete(req, res, updatedSample.sampleNumber, function(err) {

					test.equal(null, err);
					test.done();
				});
			});
		});
	});
}
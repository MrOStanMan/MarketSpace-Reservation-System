'use strict';

//grab a sample template from the schema
var Sample = require('./sample.db.schema.js');

module.exports = class SampleService {

	//========================================================
	// create
	//========================================================
	create(req, res, sourceSample, callback) {
		console.log('+ sampleService.create(%s)', JSON.stringify(sourceSample));

		//create a sample
		var targetSample = new Sample({
			userNumber: req.user.userNumber,	//Samples alwyas belong to the user who created them
			title: sourceSample.title,

			startDateTime: sourceSample.startDateTime,
			endDateTime: sourceSample.endDateTime
		});

		//save sample
		targetSample.save(function(err, newSample) {
			if (err) {
				console.log(err);
				callback(err, null);
			} else {
				callback(null, newSample);
			}
		});
	}


	//========================================================
	// findByUser
	//========================================================
	findByUser(req, res, userNumber, callback) {
		console.log('+ sampleService.findByUser ');

		Sample.find({ userNumber: userNumber})
		.exec(function (err, foundSamples) {
			if (err) {
				console.log(err);
				callback(err, null);
			} else {
				callback(null, foundSamples);
			}
		});
	}


    //========================================================
    // findByCriteria
    //========================================================
    findByCriteria(req, res, criteria, callback) {
        console.log('+ sampleService.findByCriteria ');

        Sample.find(criteria)
            .exec(function (err, foundSamples) {
                if (err) {
                    console.log(err);
                    callback(err, null);
                } else {
                    callback(null, foundSamples);
                }
            });
    }

    //========================================================
	// update
	//========================================================
	update(req, res, sampleNumber, sourceSample, callback) {
		console.log('+ sampleService.update(%d, %s)', parseInt(sampleNumber), JSON.stringify(sourceSample));

		var targetSample = {
			title: sourceSample.title,
			//modified: new Date()

            startDateTime: sourceSample.startDateTime,
            endDateTime: sourceSample.endDateTime
		};
        parseInt(sampleNumber);

        console.log("Test print for source title: " + JSON.stringify(sourceSample.title));

		Sample.findOneAndUpdate(
		{ //looks for object
			sampleNumber: sourceSample.sampleNumber,
			userNumber: req.user.userNumber	//User can only update their own samples

		},
		targetSample,
		{ //returns object
			new: true	//Return the modified document
		})
		.exec(function (err, updatedSample) {
			if (err) {
				console.log(err + "error occured here");
				callback(err, null);
			} else {
                console.log(err + "SUCCESS HERE");
				callback(null, updatedSample);
			}
		});
	}

	//========================================================
	// delete
	//========================================================
	delete(req, res, sampleNumber, callback) {
		console.log('+ sampleService.delete ');
		Sample.remove(
		{
			sampleNumber: sampleNumber,
			userNumber: req.user.userNumber		//user can only delete their own samples
		}).exec(function (err) {
			if (err) {
				console.log(err);
				callback(err);
			} else {
				callback(null);
			}
		});
	}

}

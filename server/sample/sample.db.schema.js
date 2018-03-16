'use strict';

var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

var sampleSchema = mongoose.Schema({
	sampleNumber: {type:Number, required: true}, //(sample number) auto generated
	userNumber: { type: Number, required: true },  //The owner of the document
	
	title: { type: String, required: false },  

	created: { type: Date, required: true, default: Date.now },
    modified: { type: Date, required: true, default: Date.now },

    startDateTime: { type: Date, required: true, default: Date.now },
    endDateTime: { type: Date, required: true, default: Date.now },

	isSeller: { type: Boolean, default: false},
    isCustomer: { type: Boolean, default: false},



});

sampleSchema.plugin(autoIncrement.plugin, { model: 'Sample', field: 'sampleNumber' });
module.exports = mongoose.model('Sample', sampleSchema);
'use strict'


var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

var resourceSchema = mongoose.Schema({

    resourceNumber:     { type: Number, required: true },
    userNumber:         { type: Number, required: true },
    title:              { type: String, required: true },
    capacity:           { type: Number, required: true, min: 0, max: 500 },
    startDateTime:      { type: Date, required: true, default: Date },
    endDateTime:        { type: Date, required: true, default: Date },
    isSeller:           { type: Boolean, default: false },
    isCustomer:         { type: Boolean, default: false },
    description:        { type: String, default: false },
    slots:
        [
            {
                slotNumber:         { type: String, required: false },
                slotTitle:          { type: String, required: false },
                slotStartDateTime:  { type: Date, required: false },
                slotEndDateTime:    { type: Date, required: false },
                customerNumber:     { type: Number, required: false },
                reserved:           { type: Boolean, required:false, default: false },
            },
            {
                slotNumber:         { type: String, required: false },
                slotTitle:          { type: String, required: false },
                slotStartDateTime:  { type: Date, required: false },
                slotEndDateTime:    { type: Date, required: false },
                customerNumber:     { type: Number, required: false },
                reserved:           { type: Boolean, required:false, default: false },
            },
            {
                slotNumber:         { type: String, required: false },
                slotTitle:          { type: String, required: false },
                slotStartDateTime:  { type: Date, required: false },
                slotEndDateTime:    { type: Date, required: false },
                customerNumber:     { type: Number, required: false },
                reserved:           { type: Boolean, required:false, default: false },
            },
            {
                slotNumber:         { type: String, required: false },
                slotTitle:          { type: String, required: false },
                slotStartDateTime:  { type: Date, required: false },
                slotEndDateTime:    { type: Date, required: false },
                customerNumber:     { type: Number, required: false },
                reserved:           { type: Boolean, required:false, default: false },
            },
            {
                slotNumber:         { type: String, required: false },
                slotTitle:          { type: String, required: false },
                slotStartDateTime:  { type: Date, required: false },
                slotEndDateTime:    { type: Date, required: false },
                customerNumber:     { type: Number, required: false },
                reserved:           { type: Boolean, required:false, default: false },
            },
            {
                slotNumber:         { type: String, required: false },
                slotTitle:          { type: String, required: false },
                slotStartDateTime:  { type: Date, required: false },
                slotEndDateTime:    { type: Date, required: false },
                customerNumber:     { type: Number, required: false },
                reserved:           { type: Boolean, required:false, default: false },
            },

        ]
    });

//add fields..start and end and copy date from here
resourceSchema.plugin(autoIncrement.plugin, { model: 'Resource', field: 'resourceNumber' });
module.exports = mongoose.model('Resource', resourceSchema);
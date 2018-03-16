'use strict';

//grab a resource template from the schema
var Resource = require('./resource.db.schema.js');

module.exports = class ResourceService {

    //========================================================
    // create
    //========================================================
    create(req, res, sourceResource, callback) {
        console.log('+ resourceService.create(%s)', JSON.stringify(sourceResource));

        //create a resource
        var targetResource = new Resource({
            userNumber:     req.user.userNumber,	//Samples always belong to the user who created them
            title:          sourceResource.title,
            capacity:       sourceResource.capacity,
            startDateTime:  sourceResource.startDateTime,
            endDateTime:    sourceResource.endDateTime,
            allDay:         sourceResource.allDay,
            description:    sourceResource.description,
            slots: [{},{},{},{},{},{}]
        });

        //save resource
        targetResource.save(function(err, newResource) {
            if (err) {
                console.log(err);
                callback(err, null);
            } else {
                callback(null, newResource);
            }
        });
    }

    //========================================================
    // findByUser
    //========================================================
    findByUser(req, res, userNumber, callback) {
        console.log('+ resourceService.findByUser ');

        Resource.find({ userNumber: userNumber})
            .exec(function (err, foundResources) {
                if (err) {
                    console.log(err);
                    callback(err, null);
                } else {
                    callback(null, foundResources);
                }
            });
    }


    //========================================================
    // findByCriteria
    //========================================================
    findByCriteria(req, res, criteria, callback) {
        console.log('+ resourceService.findByCriteria ');

        Resource.find(criteria)
            .exec(function (err, foundResources) {
                if (err) {
                    console.log(err);
                    callback(err, null);
                } else {
                    callback(null, foundResources);
                }
            });
    }

    //========================================================
    // update
    //========================================================
    update(req, res, resourceNumber, sourceResource, callback) {
        console.log('+ resourceNumber.update(%d, %s)', parseInt(resourceNumber), JSON.stringify(sourceResource));

        //var count;
        var targetResource;
        if(req.user.isCustomer === true)
        {
            console.log("This is the Customer");
            if(sourceResource.slots[0].reserved === true)
            {
                targetResource = {
                    title:          sourceResource.title,
                    resourceNumber: sourceResource.resourceNumber,
                    capacity:       sourceResource.capacity,
                    startDateTime:  sourceResource.startDateTime,
                    endDateTime:    sourceResource.endDateTime,
                    description:    sourceResource.description,
                    slots:
                        [
                            {
                                reserved : false
                            }
                        ]
                };
            } else
            {
                targetResource = {
                    title:          sourceResource.title,
                    resourceNumber: sourceResource.resourceNumber,
                    capacity:       sourceResource.capacity,
                    startDateTime:  sourceResource.startDateTime,
                    endDateTime:    sourceResource.endDateTime,
                    description:    sourceResource.description,
                    slots:
                        [
                            {
                                slotTitle          :    sourceResource.slots[0].slotTitle,
                                slotStartDateTime  :    sourceResource.slots[0].slotStartDateTime,
                                slotEndDateTime    :    sourceResource.slots[0].slotEndDateTime,
                                customerNumber     :    req.user.userNumber,
                                reserved : true
                            },
                            {
                                slotTitle          :    sourceResource.slots[1].slotTitle,
                                slotStartDateTime  :    sourceResource.slots[1].slotStartDateTime,
                                slotEndDateTime    :    sourceResource.slots[1].slotEndDateTime,
                                customerNumber     :    req.user.userNumber,
                                reserved : true
                            },
                            {
                                slotTitle          :    sourceResource.slots[2].slotTitle,
                                slotStartDateTime  :    sourceResource.slots[2].slotStartDateTime,
                                slotEndDateTime    :    sourceResource.slots[2].slotEndDateTime,
                                customerNumber     :    req.user.userNumber,
                                reserved : true
                            },
                            {
                                slotTitle          :    sourceResource.slots[3].slotTitle,
                                slotStartDateTime  :    sourceResource.slots[3].slotStartDateTime,
                                slotEndDateTime    :    sourceResource.slots[3].slotEndDateTime,
                                customerNumber     :    req.user.userNumber,
                                reserved : true
                            },
                            {
                                slotTitle          :    sourceResource.slots[4].slotTitle,
                                slotStartDateTime  :    sourceResource.slots[4].slotStartDateTime,
                                slotEndDateTime    :    sourceResource.slots[4].slotEndDateTime,
                                customerNumber     :    req.user.userNumber,
                                reserved : true
                            },
                            {
                                slotTitle          :    sourceResource.slots[5].slotTitle,
                                slotStartDateTime  :    sourceResource.slots[5].slotStartDateTime,
                                slotEndDateTime    :    sourceResource.slots[5].slotEndDateTime,
                                customerNumber     :    req.user.userNumber,
                                reserved : true
                            },

                        ]
                };
            }
        } else {
            console.log("This is the Seller");
            targetResource = {
                title:                              sourceResource.title,
                resourceNumber:                     sourceResource.resourceNumber,
                capacity:                           sourceResource.capacity,
                startDateTime:                      sourceResource.startDateTime,
                endDateTime:                        sourceResource.endDateTime,
                description:                        sourceResource.description,
                slots:
                    [
                        {
                        }
                    ]
            };
        }
        parseInt(resourceNumber);

        console.log("Test print for source title: " + JSON.stringify(sourceResource.title));

        Resource.findOneAndUpdate(
            { //looks for object
                resourceNumber:     sourceResource.resourceNumber

                //Uncommented temporarily to allow all users to update resources ***NOTE***
                //userNumber:         req.user.userNumber	//User can only update their own samples
            },
            targetResource,
            { //returns object
                new: true	//Return the modified document
            })
            .exec(function (err, updatedResource) {
                if (err) {
                    console.log(err + "error occured here");
                    callback(err, null);
                } else {
                    console.log(updatedResource + " SUCCESS HERE");
                    callback(null, updatedResource);
                }
            });
    }



    //========================================================
    // delete
    //========================================================
    delete(req, res, resourceNumber, callback) {
        console.log('+ resourceService.delete ');
        Resource.remove(
            {
                resourceNumber: resourceNumber,
                userNumber: req.user.userNumber		//user can only delete their own resources
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
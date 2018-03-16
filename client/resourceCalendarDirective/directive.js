myApp.directive('msResourceCalendarDirective', function ($window, $timeout, $http) {
    return {
        restrict: 'AE',
        templateUrl: '/client/resourceCalendarDirective/view.html?v=1',
        controller: function($scope, $element, $attrs, $uibModal) {

            //----------------------------------------------//
            //                                              //
            //                  CREATE EVENT                //
            //                                              //
            //----------------------------------------------//
            $scope.createEventOnCal = function (eventObj) {
                console.log('Opening modal...');
                $scope.event = eventObj;
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: '/client/resourceCreateDirective/modal.html',
                    backdrop: false,
                    keyboard: true,
                    resolve: {
                        event: function () {
                            return eventObj;
                        },
                        showModal: function() {
                            setTimeout(function () {
                                $('#create-event-modal').parent().css('z-index', '10000')
                            }, 5000);
                        }
                    }
                });

                $scope.newResource = {
                    slots:[{
                    }]
                };


                //Scope apply here to make modal show up
                $scope.$evalAsync(function() {
                    modalInstance.result.then(
                        function (event) {
                            console.log('Modal closed at: ' + new Date());
                            console.log(event);
                            //$scope.events.push(event);
                        },
                        $scope.cancel = function () {
                            modalInstance.close('cancel');
                            //console.log('Modal dismissed at: ' + new Date());
                        }
                    );
                });

            };

            //create a resource
            $scope.createResource = function () {
                $http.post('/api/v1/resource', $scope.newResource).then(function (response) {
                    $window.location.reload();
                });
            };

            //----------------------------------------------//
            //                                              //
            //                  UPDATE EVENT                //
            //                  ON CLICK                    //
            //----------------------------------------------//
            $scope.alertOnEventClick  = function (eventObj) {
                var startDate = new Date(eventObj.start);
                var endDate = new Date(eventObj.end);

                var newEvent = {
                    _id:                eventObj._id,
                    title:              eventObj.title,
                    resourceNumber:     eventObj.resourceNumber,
                    capacity:           eventObj.capacity,
                    startDateTime:      startDate,
                    endDateTime:        endDate,
                    description:        eventObj.description,
                    slots: [
                        {slotNumber: 0},
                        {slotStartDateTime: ""},
                        {slotEndDateTime: ""},
                        {slotTitle: eventObj.title},
                    ]
                };

                $scope.eventToUpdate = newEvent;

                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: '/client/resourceCalendarDirective/modal.html',
                    backdrop: false,
                    keyboard: true,
                    resolve: {
                        event: function () {
                            return eventObj;
                        },
                        showModal: function() {
                            setTimeout(function () {
                              $('#my-modal').parent().css('z-index', '10000')
                                }, 5000);
                        }
                    }
                });

                //close modal
                $scope.$evalAsync(function() {
                    modalInstance.result.then(
                        $scope.cancel = function () {
                            modalInstance.close('cancel');
                            //console.log('Modal dismissed at: ' + new Date());
                        }
                    );
                });
            };

            $scope.updateEvent = function () {
                $http.put('/api/v1/resource/' + $scope.eventToUpdate.resourceNumber,
                    $scope.eventToUpdate).then(function (response) {
                    if(response.status === 200) {
                        //$scope.events.push($scope.eventTo`);
                        $window.location.reload();
                    }
                })
            };

            //----------------------------------------------//
            //                                              //
            //                  UPDATE EVENT                //
            //                  ON DROP                     //
            //----------------------------------------------//
            /* alert on Drop */
            $scope.alertOnDrop = function(event) {
                var startDate = new Date(event.start);
                var endDate = new Date(event.end);

                var newEvent = {
                    _id: event._id,
                    title: event.title,
                    resourceNumber: event.resourceNumber,
                    capacity: event.capacity,
                    startDateTime: startDate,
                    endDateTime: endDate,
                    description: event.description,
                    slots: [
                        {slotNumber: 0},
                        {slotStartDateTime: ""},
                        {slotEndDateTime: ""},
                        {slotTitle: event.title},
                    ]
                };

                $scope.eventOnDrop = newEvent;

                // $scope.eventOnDrop.slots[0].slotTitle = $scope.eventOnDrop.title;
                // $scope.eventOnDrop.slots[0].slotNumber = $scope.eventOnDrop.slotNumber + 1;
                // $scope.eventOnDrop.slots[0].slotStartDateTime = $scope.eventOnDrop.startDateTime;
                // $scope.eventOnDrop.slots[0].slotEndDateTime = $scope.eventOnDrop.endDateTime;


                $http.put('/api/v1/resource/' + $scope.eventOnDrop.resourceNumber,
                    $scope.eventOnDrop).then(function (response) {
                    if(response.status === 200) {
                        $window.location.reload();
                    }
                });

            };

            //----------------------------------------------//
            //                                              //
            //                  DELETE EVENT                //
            //                                              //
            //----------------------------------------------//
            //delete a resource
            $scope.deleteEvent = function () {
                $http.delete('/api/v1/resource/' + $scope.eventToUpdate.resourceNumber).then(function (response) {
                    if (response.status === 200) {
                        $window.location.reload();
                    }
                    console.log('event deleted - AFTER CHECK');
                });
            };

            //----------------------------------------------//
            //                                              //
            //          CREATE EVENTS ON CALENDAR           //
            //                                              //
            //----------------------------------------------//

            $scope.events = [];

            $scope.myevents = function(start, end, timezone, callback) {
                $http.get('/api/v1/resource').then(function(response) {
                    angular.forEach(response.data, function(event,key){
                        $scope.events.push({
                            _id:                event._id,
                            title:              event.title,
                            resourceNumber:     event.resourceNumber,
                            capacity:           event.capacity,
                            start:              event.startDateTime,
                            end:                event.endDateTime,
                            description:        event.description,
                            slots:
                                [
                                    {
                                        slotNumber:           event.slotNumber,
                                    }
                                ]
                        });
                    });
                    callback($scope.events);
                });
            };

            //----------------------------------------------//
            //                                              //
            //               EVENT DESCRIPTION              //
            //                                              //
            //----------------------------------------------//
            $scope.eventDetails = function(event, element, view)
            {
                if (view.name === "agendaWeek") {
                    element.find(".fc-content")
                        .append("<br/>" + "<b>Details: </b>" + event.description);
                }
            };



            //----------------------------------------------//
            //                                              //
            //                  CALL CALENDAR               //
            //                                              //
            //----------------------------------------------//
            $scope.isSeller = true;

            $scope.uiConfig = {
                calendar: {
                    height: 650,
                    editable: true,
                    resizable: true,
                    displayEventTime: true,
                    durationEditable: true,
                    timeFormat: 'hh:mm a',
                    timezone: 'local',
                    header: {
                        left: 'month agendaWeek createEvent',
                        center: 'title',
                        right: 'prev,next '
                    },
                    customButtons: {
                        createEvent: {
                            text: '+',
                            click: $scope.createEventOnCal
                        }
                    },
                    eventClick: $scope.alertOnEventClick,
                    eventDrop: $scope.alertOnDrop,
                    eventRender: $scope.eventDetails
                }
            };

            // linking event array to calendar to be displayed
            $scope.eventSources = [$scope.myevents];

        }
    }
});
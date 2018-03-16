myApp.directive('msCustomerDirective', function ($window, $timeout, $http) {
    return {
        restrict: 'AE',
        templateUrl: '/client/resourceCustomerDirective/view.html?v=1',
        controller: function($scope, $element, $attrs, $uibModal) {

            $scope.isCustomer = true;

            //----------------------------------------------//
            //                                              //
            //          OPEN RESERVE MODAL                  //
            //                                              //
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
                    slots:[
                        {
                        },
                        {
                        },
                        {
                        },
                        {
                        },
                        {
                        },
                        {
                        }
                    ]
                };

                $scope.bookSlot = newEvent;


                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: '/client/resourceCustomerDirective/modal.html',
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
                            console.log('Modal dismissed at: ' + new Date());
                        }
                    );
                });

                //----------------------------------------------//
                //                                              //
                //          RESERVE EVENT                       //
                //                                              //
                //----------------------------------------------//
                $scope.reserveEvent = function() {
                    $scope.bookSlot.slots[0].slotTitle = $scope.bookSlot.title;
                    $scope.bookSlot.slots[0].slotStartDateTime = $scope.bookSlot.startDateTime;
                    $scope.bookSlot.slots[0].slotEndDateTime = $scope.bookSlot.endDateTime;

                    $scope.bookSlot.slots[1].slotTitle = $scope.bookSlot.title;
                    $scope.bookSlot.slots[1].slotStartDateTime = $scope.bookSlot.startDateTime;
                    $scope.bookSlot.slots[1].slotEndDateTime = $scope.bookSlot.endDateTime;


                    $scope.bookSlot.slots[2].slotTitle = $scope.bookSlot.title;
                    $scope.bookSlot.slots[2].slotStartDateTime = $scope.bookSlot.startDateTime;
                    $scope.bookSlot.slots[2].slotEndDateTime = $scope.bookSlot.endDateTime;


                    $scope.bookSlot.slots[3].slotTitle = $scope.bookSlot.title;
                    $scope.bookSlot.slots[3].slotStartDateTime = $scope.bookSlot.startDateTime;
                    $scope.bookSlot.slots[3].slotEndDateTime = $scope.bookSlot.endDateTime;

                    $scope.bookSlot.slots[4].slotTitle = $scope.bookSlot.title;
                    $scope.bookSlot.slots[4].slotStartDateTime = $scope.bookSlot.startDateTime;
                    $scope.bookSlot.slots[4].slotEndDateTime = $scope.bookSlot.endDateTime;

                    $scope.bookSlot.slots[5].slotTitle = $scope.bookSlot.title;
                    $scope.bookSlot.slots[5].slotStartDateTime = $scope.bookSlot.startDateTime;
                    $scope.bookSlot.slots[5].slotEndDateTime = $scope.bookSlot.endDateTime;



                    $http.put('/api/v1/resource/' + $scope.bookSlot.resourceNumber, $scope.bookSlot).then(function (response) {
                        if(response.status === 200) {
                            //$window.location.reload();
                            $scope.bookSlot.slots[0].reserved = !$scope.bookSlot.slots[0].reserved;
                            console.log('here after ' + $scope.bookSlot.slots[2].slotTitle);

                        }
                    });
                };

                $scope.cancelEvent = function() {
                    //$scope.bookSlot.slots[0].reserved = false;
                    $http.put('/api/v1/resource/' + $scope.bookSlot.resourceNumber, $scope.bookSlot).then(function (response) {
                        if(response.status === 200) {
                            $scope.bookSlot.slots[0].reserved = !$scope.bookSlot.slots[0].reserved;
                            //$window.location.reload();
                        }
                    });
                };
            };



            //----------------------------------------------//
            //                                              //
            //          OPEN RESERVED EVENTS MODAL          //
            //                                              //
            //----------------------------------------------//
            $scope.reservedEvents = {};
            $scope.showMyEvents = function() {
                $http.get('/api/v1/resource/' + $scope.reservedEvents.resourceNumber).then(function (response) {
                    $scope.reservedEvents = response.data;

                    console.log('here');
                    console.log($scope.reservedEvents[0].slots[0].slotTitle);
                    
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: '/client/resourceCustomerDirective/myEventsModal.html',
                    backdrop: false,
                    keyboard: true,
                    resolve: {
                        event: function () {
                            return $scope.reservedEvents;
                        },
                        showModal: function() {
                            setTimeout(function () {
                                $('#my-reserved-events').parent().css('z-index', '10000')
                            }, 5000);
                        }
                    }
                });

                //close modal
                $scope.$evalAsync(function() {
                    modalInstance.result.then(
                        $scope.cancel = function () {
                            modalInstance.close('cancel');
                            console.log('Modal dismissed at: ' + new Date());
                        }
                    );
                });
                });
            };


            $scope.events = [];

            //----------------------------------------------//
            //                                              //
            //          CREATE EVENTS ON CALENDAR           //
            //                                              //
            //----------------------------------------------//
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
                            description:        event.description
                        });
                    });

                    callback($scope.events);
                });
            };

            //----------------------------------------------//
            //                                              //
            //                  CALL CALENDAR               //
            //                                              //
            //----------------------------------------------//
            $scope.uiConfig = {
                calendar: {
                    height: 650,
                    editable: false,
                    displayEventTime: true,
                    durationEditable: true,
                    timeFormat: 'hh:mm a',
                    timezone: 'local',
                    header: {
                        left: 'month agendaWeek viewAvailableEvents',
                        center: 'title',
                        right: 'prev,next '
                    },
                    customButtons: {
                        viewAvailableEvents: {
                            text: 'My Events',
                            click: $scope.showMyEvents
                        },

                    },
                    eventClick: $scope.alertOnEventClick
                }
            };

            // linking event array to calendar to be displayed
            $scope.eventSources = [$scope.myevents];

        }
    }
});
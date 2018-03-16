var myApp = angular.module("myApp", [ "ngAnimate", "ngSanitize", "angular.vertilize", "ui.sortable", "ui.bootstrap", "ui.bootstrap.modal", "LocalStorageModule", "toastr", "ui.calendar" ]);

myApp.directive("msDateTimePicker", function($window, $timeout, $http, $log, $filter) {
    return {
        restrict: "E",
        scope: {
            ngModel: "=",
            "class": "@",
            placeholder: "@",
            altInputFormats: "=?"
        },
        templateUrl: "/client/dateTimePicker/view.html?v=2",
        compile: function(scope) {
            if (!scope.altInputFormats) {
                scope.altInputFormats = [ "M!/d!/yyyy HH:mm" ];
            }
        },
        link: function(scope, element, attrs) {
            scope.format = "MMM dd, yyyy, HH:mm";
        },
        controller: function($scope, $element, $attrs) {
            var filteredTime;
            var filteredDate;
            $scope.$watch("ngModel", function(newVal, convertedDate) {
                convertedDate = $filter("date")(new Date(newVal), "MMM-dd-yyyy HH:mmZ");
                $scope.ngModel = convertedDate;
                if (typeof newVal === "date") {
                    $scope.ngModel = newVal;
                } else if (newVal instanceof Date) {
                    $scope.ngModel = newVal;
                } else if (typeof newVal === "string") {
                    $scope.ngModel = new Date(newVal);
                }
            });
            $scope.$watch("ngModelDate", function(newVal, oldVal) {
                if (newVal) {
                    $scope.ngModel = newVal;
                }
            });
            $scope.hstep = 1;
            $scope.mstep = 30;
            $scope.ismeridian = true;
        }
    };
});

myApp.directive("msResourceCalendarDirective", function($window, $timeout, $http) {
    return {
        restrict: "AE",
        templateUrl: "/client/resourceCalendarDirective/view.html?v=1",
        controller: function($scope, $element, $attrs, $uibModal) {
            $scope.createEventOnCal = function(eventObj) {
                console.log("Opening modal...");
                $scope.event = eventObj;
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: "/client/resourceCreateDirective/modal.html",
                    backdrop: false,
                    keyboard: true,
                    resolve: {
                        event: function() {
                            return eventObj;
                        },
                        showModal: function() {
                            setTimeout(function() {
                                $("#create-event-modal").parent().css("z-index", "10000");
                            }, 5e3);
                        }
                    }
                });
                $scope.newResource = {
                    slots: [ {} ]
                };
                $scope.$evalAsync(function() {
                    modalInstance.result.then(function(event) {
                        console.log("Modal closed at: " + new Date());
                        console.log(event);
                    }, $scope.cancel = function() {
                        modalInstance.close("cancel");
                    });
                });
            };
            $scope.createResource = function() {
                $http.post("/api/v1/resource", $scope.newResource).then(function(response) {
                    $window.location.reload();
                });
            };
            $scope.alertOnEventClick = function(eventObj) {
                var startDate = new Date(eventObj.start);
                var endDate = new Date(eventObj.end);
                var newEvent = {
                    _id: eventObj._id,
                    title: eventObj.title,
                    resourceNumber: eventObj.resourceNumber,
                    capacity: eventObj.capacity,
                    startDateTime: startDate,
                    endDateTime: endDate,
                    description: eventObj.description,
                    slots: [ {
                        slotNumber: 0
                    }, {
                        slotStartDateTime: ""
                    }, {
                        slotEndDateTime: ""
                    }, {
                        slotTitle: eventObj.title
                    } ]
                };
                $scope.eventToUpdate = newEvent;
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: "/client/resourceCalendarDirective/modal.html",
                    backdrop: false,
                    keyboard: true,
                    resolve: {
                        event: function() {
                            return eventObj;
                        },
                        showModal: function() {
                            setTimeout(function() {
                                $("#my-modal").parent().css("z-index", "10000");
                            }, 5e3);
                        }
                    }
                });
                $scope.$evalAsync(function() {
                    modalInstance.result.then($scope.cancel = function() {
                        modalInstance.close("cancel");
                    });
                });
            };
            $scope.updateEvent = function() {
                $http.put("/api/v1/resource/" + $scope.eventToUpdate.resourceNumber, $scope.eventToUpdate).then(function(response) {
                    if (response.status === 200) {
                        $window.location.reload();
                    }
                });
            };
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
                    slots: [ {
                        slotNumber: 0
                    }, {
                        slotStartDateTime: ""
                    }, {
                        slotEndDateTime: ""
                    }, {
                        slotTitle: event.title
                    } ]
                };
                $scope.eventOnDrop = newEvent;
                $http.put("/api/v1/resource/" + $scope.eventOnDrop.resourceNumber, $scope.eventOnDrop).then(function(response) {
                    if (response.status === 200) {
                        $window.location.reload();
                    }
                });
            };
            $scope.deleteEvent = function() {
                $http.delete("/api/v1/resource/" + $scope.eventToUpdate.resourceNumber).then(function(response) {
                    if (response.status === 200) {
                        $window.location.reload();
                    }
                    console.log("event deleted - AFTER CHECK");
                });
            };
            $scope.events = [];
            $scope.myevents = function(start, end, timezone, callback) {
                $http.get("/api/v1/resource").then(function(response) {
                    angular.forEach(response.data, function(event, key) {
                        $scope.events.push({
                            _id: event._id,
                            title: event.title,
                            resourceNumber: event.resourceNumber,
                            capacity: event.capacity,
                            start: event.startDateTime,
                            end: event.endDateTime,
                            description: event.description,
                            slots: [ {
                                slotNumber: event.slotNumber
                            } ]
                        });
                    });
                    callback($scope.events);
                });
            };
            $scope.eventDetails = function(event, element, view) {
                if (view.name === "agendaWeek") {
                    element.find(".fc-content").append("<br/>" + "<b>Details: </b>" + event.description);
                }
            };
            $scope.isSeller = true;
            $scope.uiConfig = {
                calendar: {
                    height: 650,
                    editable: true,
                    resizable: true,
                    displayEventTime: true,
                    durationEditable: true,
                    timeFormat: "hh:mm a",
                    timezone: "local",
                    header: {
                        left: "month agendaWeek createEvent",
                        center: "title",
                        right: "prev,next "
                    },
                    customButtons: {
                        createEvent: {
                            text: "+",
                            click: $scope.createEventOnCal
                        }
                    },
                    eventClick: $scope.alertOnEventClick,
                    eventDrop: $scope.alertOnDrop,
                    eventRender: $scope.eventDetails
                }
            };
            $scope.eventSources = [ $scope.myevents ];
        }
    };
});

myApp.directive("msCustomerDirective", function($window, $timeout, $http) {
    return {
        restrict: "AE",
        templateUrl: "/client/resourceCustomerDirective/view.html?v=1",
        controller: function($scope, $element, $attrs, $uibModal) {
            $scope.isCustomer = true;
            $scope.alertOnEventClick = function(eventObj) {
                var startDate = new Date(eventObj.start);
                var endDate = new Date(eventObj.end);
                var newEvent = {
                    _id: eventObj._id,
                    title: eventObj.title,
                    resourceNumber: eventObj.resourceNumber,
                    capacity: eventObj.capacity,
                    startDateTime: startDate,
                    endDateTime: endDate,
                    description: eventObj.description,
                    slots: [ {}, {}, {}, {}, {}, {} ]
                };
                $scope.bookSlot = newEvent;
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: "/client/resourceCustomerDirective/modal.html",
                    backdrop: false,
                    keyboard: true,
                    resolve: {
                        event: function() {
                            return eventObj;
                        },
                        showModal: function() {
                            setTimeout(function() {
                                $("#my-modal").parent().css("z-index", "10000");
                            }, 5e3);
                        }
                    }
                });
                $scope.$evalAsync(function() {
                    modalInstance.result.then($scope.cancel = function() {
                        modalInstance.close("cancel");
                        console.log("Modal dismissed at: " + new Date());
                    });
                });
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
                    $http.put("/api/v1/resource/" + $scope.bookSlot.resourceNumber, $scope.bookSlot).then(function(response) {
                        if (response.status === 200) {
                            $scope.bookSlot.slots[0].reserved = !$scope.bookSlot.slots[0].reserved;
                            console.log("here after " + $scope.bookSlot.slots[2].slotTitle);
                        }
                    });
                };
                $scope.cancelEvent = function() {
                    $http.put("/api/v1/resource/" + $scope.bookSlot.resourceNumber, $scope.bookSlot).then(function(response) {
                        if (response.status === 200) {
                            $scope.bookSlot.slots[0].reserved = !$scope.bookSlot.slots[0].reserved;
                        }
                    });
                };
            };
            $scope.reservedEvents = {};
            $scope.showMyEvents = function() {
                $http.get("/api/v1/resource/" + $scope.reservedEvents.resourceNumber).then(function(response) {
                    $scope.reservedEvents = response.data;
                    console.log("here");
                    console.log($scope.reservedEvents[0].slots[0].slotTitle);
                    var modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: "/client/resourceCustomerDirective/myEventsModal.html",
                        backdrop: false,
                        keyboard: true,
                        resolve: {
                            event: function() {
                                return $scope.reservedEvents;
                            },
                            showModal: function() {
                                setTimeout(function() {
                                    $("#my-reserved-events").parent().css("z-index", "10000");
                                }, 5e3);
                            }
                        }
                    });
                    $scope.$evalAsync(function() {
                        modalInstance.result.then($scope.cancel = function() {
                            modalInstance.close("cancel");
                            console.log("Modal dismissed at: " + new Date());
                        });
                    });
                });
            };
            $scope.events = [];
            $scope.myevents = function(start, end, timezone, callback) {
                $http.get("/api/v1/resource").then(function(response) {
                    angular.forEach(response.data, function(event, key) {
                        $scope.events.push({
                            _id: event._id,
                            title: event.title,
                            resourceNumber: event.resourceNumber,
                            capacity: event.capacity,
                            start: event.startDateTime,
                            end: event.endDateTime,
                            description: event.description
                        });
                    });
                    callback($scope.events);
                });
            };
            $scope.uiConfig = {
                calendar: {
                    height: 650,
                    editable: false,
                    displayEventTime: true,
                    durationEditable: true,
                    timeFormat: "hh:mm a",
                    timezone: "local",
                    header: {
                        left: "month agendaWeek viewAvailableEvents",
                        center: "title",
                        right: "prev,next "
                    },
                    customButtons: {
                        viewAvailableEvents: {
                            text: "My Events",
                            click: $scope.showMyEvents
                        }
                    },
                    eventClick: $scope.alertOnEventClick
                }
            };
            $scope.eventSources = [ $scope.myevents ];
        }
    };
});

myApp.directive("msResourceListDirective", function($window, $timeout, $http, $log) {
    return {
        restrict: "E",
        templateUrl: "/client/resourceListDirective/view.html",
        controller: function($scope, $element, $attrs) {
            $scope.clickedUser = {};
            $scope.modifiedSample = {};
            $scope.updateModal = function(sample) {
                $scope.sample = sample;
            };
            $scope.updateResource = function() {
                $http.update("/api/v1/sample/" + $scope.sample.sampleNumber, $scope.sample).then(function(response) {
                    if (response.status === 200) {
                        $window.location.reload();
                    }
                });
            };
        }
    };
});

myApp.directive("msUpdateResourceEventCalendarDirective", function($window, $timeout, $http, $log) {
    return {
        restrict: "E",
        templateUrl: "/client/resourceUpdateEventCalendar/view.html",
        controller: function($scope, $element, $attrs, $uibModal) {}
    };
});

myApp.directive("msSampleDirective", function($window, $timeout, $http) {
    return {
        restrict: "E",
        templateUrl: "/client/sampleDirective/view.html?v=1",
        controller: function($scope, $element, $attrs) {
            $http.get("/api/v1/sample?theParameter=this-is-a-test").then(function(response) {
                $scope.sample = response.data;
            });
        }
    };
});
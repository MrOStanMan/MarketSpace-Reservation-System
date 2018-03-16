myApp.directive('msUpdateResourceEventCalendarDirective', function ($window, $timeout, $http, $log) {
    return {

        restrict: 'E',
        templateUrl: '/client/resourceUpdateEventCalendar/view.html',

        //this controller will only work in this directive
        controller: function ($scope, $element, $attrs, $uibModal) {
        }
    }
});
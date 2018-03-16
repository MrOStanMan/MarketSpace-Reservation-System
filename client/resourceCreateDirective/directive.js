// myApp.directive('msResourceCreateDirective', function ($window, $timeout, $http, $log) {
//     return {
//         restrict: 'E',
//         templateUrl: '/client/resourceCreateDirective/view.html?v=8',
//         controller: function ($scope, $element, $attrs) {
//
//             $scope.isSeller = true;
//             //$scope.newSample = {};
//             $scope.newResource = {};
//
//             //create a resource
//             $scope.createResource = function () {
//                 console.log('i call this func');
//                 $http.post('/api/v1/resource', $scope.newResource).then(function (response) {
//                     //$scope.listSampleFunc();
//                     /createResource/$window.location.reload();
//                 });
//             };
//         }
//     }
// });

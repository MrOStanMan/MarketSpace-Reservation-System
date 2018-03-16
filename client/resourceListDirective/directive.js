myApp.directive('msResourceListDirective', function ($window, $timeout, $http, $log) {
    return {

        restrict: 'E',
        templateUrl: '/client/resourceListDirective/view.html',

        //this controller will only work in this directive
        controller: function($scope, $element, $attrs) {

            $scope.clickedUser = {};
            $scope.modifiedSample = {};

            // // list resources in a table
            // $scope.listSampleFunc = function () {
            //     $http.get('/api/v1/sample')
            //         .then(function (response) {
            //             $scope.samples = response.data;
            //             $log.info(response)
            //         })
            // };

            //when u load the page, call the function
            //$scope.listSampleFunc();
            // $scope.isSeller = true;
            //
            // //delete a resource
            // $scope.deleteResource = function (sampleNumber) {
            //     $http.delete('/api/v1/sample/' + sampleNumber).then(function (response) {
            //         //$scope.ServerResponse = response.data
            //         if (response.status === 200) {
            //             $window.location.reload();
            //         }
            //     });
            // };

            //open modal to update resource
            $scope.updateModal = function (sample) {
                    $scope.sample = sample;
            };

            //update resource
            $scope.updateResource = function () {
                $http.update('/api/v1/sample/' + $scope.sample.sampleNumber, $scope.sample).then(function (response) {
                    if(response.status === 200) {
                        $window.location.reload();
                    }
                })
            };
        }
    }
}
);
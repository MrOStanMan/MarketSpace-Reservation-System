//myApp calls directive and grab the name from the element tag in home.view.js
myApp.directive('msSampleDirective', function ($window, $timeout, $http) {
	return {
        //this means $scope can only reference ELEMENTS by directive
		restrict: 'E',

        // this page will be loaded
		templateUrl: '/client/sampleDirective/view.html?v=1',

		controller: function($scope, $element, $attrs) {

			//Get sample data
            //send request for data
			$http.get('/api/v1/sample?theParameter=this-is-a-test')
			.then(function(response) { //response is the data
				$scope.sample = response.data;
			});
		}
	}
});

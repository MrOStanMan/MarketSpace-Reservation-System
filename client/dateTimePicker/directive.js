myApp.directive('msDateTimePicker', function ($window, $timeout, $http, $log, $filter) {
	return {
		restrict: 'E',
		scope: {
			ngModel: '=',			//Use ng-model name by convention
			class: '@',
			placeholder: '@',
			altInputFormats: '=?',	//Optional
		},
		templateUrl: '/client/dateTimePicker/view.html?v=2',
		compile: function(scope) {
			if (!scope.altInputFormats) {
				scope.altInputFormats = ['M!/d!/yyyy HH:mm'];
			}
		},
		link: function(scope, element, attrs) {
			scope.format = 'MMM dd, yyyy, HH:mm';
		},
		controller: function($scope, $element, $attrs) {
            var filteredTime;
            var filteredDate;

			$scope.$watch('ngModel', function(newVal, convertedDate){
				//$log.info("HERE------");

				//$scope.ngModel = newVal;
                //$log.info($scope.filteredFinalData);

                // $log.info("Printing the newVal Object: " + newVal);
                // $log.info("$scope.ngModel" + $scope.ngModel);

                //$log.info("newVal: " + $filter('date')(new Date(newVal),'MMM-dd-yyyy HH:mmZ'));
				convertedDate = $filter('date')(new Date(newVal),'MMM-dd-yyyy HH:mmZ' );
				$scope.ngModel = convertedDate;

                //var filteredDateTime = (filteredDate + filteredTime);

				if (typeof newVal === 'date') {
					$scope.ngModel = newVal;

				} else if (newVal instanceof Date) {
					$scope.ngModel = newVal;

				} else if (typeof newVal === 'string') {
					$scope.ngModel = new Date(newVal);
				}
			});

            $scope.$watch('ngModelDate', function(newVal, oldVal){
                if (newVal) {
                    //filteredDate = $filter('date')(new Date(newVal),'MMM-dd-yyyy' );
                    //$log.info(filteredDate);
                    $scope.ngModel = newVal;
                }
            });


            // $scope.$watch('ngModelTime', function(newVal){
            //     if (newVal) {
            //     	$log.info("Entered the ngModeTime values ");
            //         filteredTime = $filter('date')(new Date(newVal), 'HH:mm');
            //
            //         $log.info("Filtered var time");
            //         $log.info(filteredTime);
            //         //$scope.ngModel = newVal;
            //     }
            // });


            //$scope.filteredFinalData = Date((filteredDate  + ' ' + filteredTime));
            $scope.hstep = 1;
            $scope.mstep = 30;
            $scope.ismeridian = true;
		}
	}
});
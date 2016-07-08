'use strict';

nugNgApp.controller('sensorCtrl', ['$scope', '$http','sensorlist','sensor', function($scope, $http, sensorlist,sensor) {

  var init = function() {

	$scope.sensor = sensor;
	$scope.msg = "";

	$scope.editSensor = function(){
		sensorlist.edit($scope.sensor);
		$scope.msg = "Update Successful";
	}

	//console.log(sensor);

  };

  init();

}])

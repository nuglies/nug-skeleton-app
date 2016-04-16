'use strict';

nugNgApp.controller('settingsCtrl', ['$scope', '$http', function($scope, $http) {

  var init = function() {
    // just stick some data on scope
    $scope.now = moment().format("dddd, MMMM Do YYYY, h:mm:ss a");
  };

  init();

}])

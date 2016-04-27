'use strict';

nugNgApp.controller('dashboardCtrl', ['$scope', '$http', function($scope, $http) {

  var init = function() {

    $http.get('/dashboard')
      .then(
        function(response) {
          $scope.things = response.data;
        },
        function(error) {
          console.log('caught error requesting /dashboard', error);
        }
      )
  
  

  	
  	
  };

  init();

}])

'use strict';

nugNgApp.controller('dashboardCtrl', ['$scope', '$http','auth','$location', 'store', function($scope, $http, auth, $location, store) {

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
  
  $scope.auth = auth;
  

	$scope.logout = function() {
    auth.signout();
    store.remove('profile');
    store.remove('token');
    $location.path('/login');
  	}
  	
  	
  };

  init();

}])

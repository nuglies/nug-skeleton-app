// loginCtrl.js
'use strict';
angular.module('nug-skeleton-app').controller( 'loginCtrl',['$scope', '$http','auth','$location', 'store', function($scope, $http, auth, $location, store) {

  $scope.auth = auth;
  
  
  
  auth.signin({
     icon: 'http://dopediary.com/wp-content/uploads/2011/01/heaven-og-nugs.jpg'
  });
  
  
	

}]);





nugNgApp.controller( 'logoutCtrl',['$scope', '$http','auth','$location', 'store', function($scope, $http, auth, $location, store) {

  $scope.auth = auth;
  
  
	$scope.logout = function() {
    auth.signout();
    store.remove('profile');
    store.remove('token');
    $location.path('/login');
  	}

}]);





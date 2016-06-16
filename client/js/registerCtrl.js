'use strict';

nugNgApp.controller('registerCtrl', ['$scope', '$http', '$cookies','$location','$timeout', 'auth','userData','asyncAddCustomer','asyncJoinCustomer','store', function($scope, $http, $cookies, $location, $timeout, auth, userData, asyncAddCustomer,asyncJoinCustomer, store) {



  
  
  var init = function($scope) {
	
	
		//execute on submit form
  $scope.addUser = function() {
  
  
	
	if($scope.userForm.clientAction == "new") {	
	
	
	//first create a new company
	
	
	asyncAddCustomer.addCustomerForProfile($scope.userForm.company,$scope.userForm.secretCode,auth.profile).then(function(userData) {
	
	console.log(userData);
	
	
	$scope.message = "Account created, redirecting...";
	store.set('nugProfile', userData);
	$cookies.nugProfile = userData; 	
	
	$timeout(function() {
        	$location.path('/settings');
    }, 3000);
	
	});
	
	/*
	$scope.addUser = function() {
		//console.log($scope.userForm);
		 userData.create({
			email: $scope.userForm.email,
			company: $scope.userForm.company,
			secretcode: $scope.userForm.secretCode
  		});
		
		}
	*/
      } //if 
      else {
      console.log("join");
      
      asyncJoinCustomer.joinProfileToCustomer($scope.userForm.secretCode,auth.profile).then(function(userData) {
		
      
		//console.log(userData);
		
		
	 if(userData.userid == 0) {
	 	$scope.scMessage = "Incorrect secret code, please try again";
	 } else {
	 	//success
	 	$scope.scMessage = "Secret Code Matched...";
	 	$scope.message = "Account created, redirecting...";
	 	store.set('nugProfile', userData);
	 	$cookies.nugProfile = userData; 	
		$timeout(function() {
        	$location.path('/settings');
    	}, 3000);
	

	 	
	 	
	 }
	 
	 
      });
    } //else
  
  }; //addUser function
  
  
  
	//console.log($cookies.nugobject);
	//console.log(auth.profile);
	$scope.secretcode = 1;
	$scope.scMessage = "Set a secret code to share with your colleagues";
	$scope.companyfield = 1;
	$scope.userForm = {
        //email: $cookies.nugobject.email,
        email: auth.profile.email,
        clientAction: "new",
        secretCode: "",
        company: ""
      };
      
     if(auth.profile.email != "") {
     $scope.editEmail = false;
     }
      
    $scope.clientActUp = function() {
		//console.log($scope.userForm);
		if($scope.userForm.clientAction =="join") {
		$scope.companyfield = 0;
		$scope.scMessage = "Provide the secret code to join your team";
		} else {
		$scope.companyfield = 1;
		$scope.scMessage = "Set a secret code to share with your colleagues";
		}
		
		}
	
	
	
	switch ($scope.regiReason) {
	case "noCustomer":
		$scope.message = "What group are you with?";
		$scope.userForm.clientAction = "join";
		break;
	default :
		$scope.message = "Please complete registration";
		
	}
	/*
    $http.get('/dashboard')
      .then(
        function(response) {
          $scope.things = response.data;
        },
        function(error) {
          console.log('caught error requesting /dashboard', error);
        }
      )
   	*/
  
  
  
  };

  init($scope);

}])

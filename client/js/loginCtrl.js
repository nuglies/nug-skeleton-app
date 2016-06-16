// loginCtrl.js
'use strict';
nugNgApp.controller( 'loginCtrl',['$scope', '$http','auth','$location', 'store','userData', '$cookies', 'asyncLu', function($scope, $http, auth, $location, store, userData,$cookies, asyncLu) {



  $scope.auth = auth;
  $scope.userData = userData.users;






  auth.signin({
     icon: '/img/nuglies.jpg'
  }, function(profile, idToken, accessToken, state, refreshToken) {
  // All good
	console.log(profile);


	////////cookie test
	var nugUserObj = {
		'user_id' : 'value from auth0',
		'customer_id' : 'customer_id'

		};

    //$cookies.nugobject = nugUserObj;
    $scope.usingCookies = { 'cookies.nugobject' : $cookies.nugobject};

	var a0 = [];
	a0['uid'] = profile.identities[0].user_id;
	a0['email'] = profile.email;
	a0['name'] = profile.name;
	a0['gci'] = profile.global_client_id;
	$cookies.nugobject = a0;


  ////cookie test






  	//if user exists then they should be associated with a customer (company)

  	//if user does not exist then we need to know whether their company is new or exists

  	//based on these decisions we can determine whether to send the user to the company setup page or to the dashboard



  asyncLu.getUserByEmail(a0['email']).then(function(userData) {

      if(userData.length != 0) {

      $scope.userData = userData[0];

      console.log($scope.userData);
      $scope.customer_id = $scope.userData.customer_id;

      console.log("customer id: "+ $scope.customer_id);
      if(!$scope.customer_id) {
      //not associated to customer, redirect to registration page
      	$scope.regiReason = "noCustomer";

	  	$location.path('/register');
      } else {
      	//user data is sufficient, redirect to dashboard
		  $location.path('/dashboard');
      }

      //console.log($scope.userData);
      } else {
      // no user exists, redirect to registration page
      $scope.regiReason = "noUser";
	  $location.path('/register');
      }

    });

	  /*

  	var gotUser = $scope.getUser();

  	console.log(gotUser);
  	*/



  /*

	  	$scope.addUser = function(){

  		userData.create({
    	name: "test"
  		});


  		userData.create({
    	name: profile.name,
    	email: profile.email,
    	user_id: profile.identities[0].user_id,
  		picture: profile.picture
  		});

  	};
  	*/


}, function(error) {
  // Error
});




}]);





nugNgApp.controller( 'logoutCtrl',['$scope', '$http','auth','$location', 'store', '$cookies','$cookieStore', function($scope, $http, auth, $location, store,$cookies) {

  $scope.auth = auth;


	$scope.logout = function() {
    auth.signout();
    store.remove('profile');
    store.remove('token');
    $location.path('/login');
  	}

}]);



nugNgApp.factory('asyncLu', function($q, $http) {








  var getUserByEmail = function(email) {
    var deferred = $q.defer();


  		var durl = "/users";

  		  $http.get(

  		  durl, {
		  params: { email: email}
			}
  		  ).then(function(res){

    		//console.log(res.data.length);

		  	//first we check whether this user exists in our records

   			 deferred.resolve(res.data);

			//    return res.data;
  			});


    return deferred.promise;
  };
	//console.log(getMessages);
  return {
    getUserByEmail: getUserByEmail
  };

});




nugNgApp.factory('asyncAddCustomer', function($q, $http) {



  var addCustomerForProfile = function(company, secretcode, profile) {

    var deferred = $q.defer();

	var durl = "/customers";

	//console.log("post this: " + secretcode);
  $http.post(

  durl, {
  params: { company: company, secretcode: secretcode, isAdmin: 1, userData: profile}
	}
  ).then(function(res){


	 deferred.resolve(res.data);

	//    return res.data;
	});
  return deferred.promise;

  };


	//console.log(getMessages);
  return {
    addCustomerForProfile: addCustomerForProfile
  };

});


nugNgApp.factory('asyncJoinCustomer', function($q, $http) {



  var joinProfileToCustomer = function(secretcode, profile) {

    var deferred = $q.defer();

	var durl = "/customercode";

	//console.log("post this: " + secretcode);
  $http.post(

  durl, {
  params: { secretcode: secretcode, isAdmin: 0, userData: profile}
	}
  ).then(function(res){


	 deferred.resolve(res.data);

	//    return res.data;
	});
  return deferred.promise;

  };


	//console.log(getMessages);
  return {
    joinProfileToCustomer: joinProfileToCustomer
  };

});

nugNgApp.factory('userData', ['$http', function($http){

console.log('userData factory');
var o = {users:[]};

o.get = function(id) {
  return $http.get('/users/' + id).then(function(res){

    console.log(res.data);
    return res.data;
  });
};

o.getAll = function() {
    return $http.get('/users').success(function(data){
      angular.copy(data, o.sensors);
      //console.log("posts data");
      console.log(data);
    });
  };

o.create = function(profile) {
	  return $http.post('/users', profile).success(function(data){
		o.users.push(data);
	  });
	};



return o;

}]);


'use strict';

nugNgApp.controller('settingsCtrl', ['$scope', '$http', '$cookies','sensorlist', 'store', 'asyncSensors', function($scope, $http, $cookies,sensorlist, store, asyncSensors) {

	$scope.nugProfile = store.get('nugProfile');
	
	var customerid = $scope.nugProfile.customerid;
	var userid = $scope.nugProfile.userid;
	
	
	console.log("customerid:" + customerid);

 //$scope.sensorlist = sensorlist.sensors;
 
 
  //$scope.sensorlist = sensorlist.getAll(customerid);
  
  asyncSensors.getSensorsForCompany(customerid).then(function(sensorData) {
  	$scope.sensorlist = sensorData;    
    
	  console.log($scope.sensorlist);
      
    });	
 
  $scope.addSensor = function(){
  if(!$scope.sensorName || $scope.sensorName === '') { return; }
  sensorlist.create({
    sensorName: $scope.sensorName,
    strain: $scope.strain,
    customerid: $scope.nugProfile.customerid
  });
  $scope.sensorName = '';
  $scope.strain = '';
	};
  
	
	
	
	
	
	


  var init = function() {
    // just stick some data on scope
    $scope.now = moment().format("dddd, MMMM Do YYYY, h:mm:ss a");
  };

  init();

}])



nugNgApp.factory('asyncSensors', function($q, $http) {


	 

  
  
  
  
  var getSensorsForCompany = function(customerid) {
    var deferred = $q.defer();
    
    	
  		var durl = "/sensors";
  		
  		  $http.get(
  		  
  		  durl, {
		  params: { customerid: customerid}
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
    getSensorsForCompany: getSensorsForCompany
  };

});


nugNgApp.factory('sensorlist', ['$http', function($http){

var o = {sensors:[],sensorsettings:[]};

o.get = function(id) {
  return $http.get('/sensors/' + id).then(function(res){
    
    //console.log(res.data);
    return res.data;
  });
};

o.getAll = function(customerid) {
	console.log("inside sensorlist");
	console.log(customerid);
    return $http.get('/sensors').success(function(data){
      angular.copy(data, o.sensors);
      //console.log("posts data");
      console.log(data);
    });
  };
  
  o.getSettings = function(id) {
  
   return $http.get('/sensors/'+id+'/sensorsettings/').success(function(data){
      angular.copy(data, o.sensorsettings);
      //console.log("posts data");
      //console.log(data);
    });
  
  };
  
	o.create = function(sensor) {
	  return $http.post('/sensors', sensor).success(function(data){
		o.sensors.push(data);
	  });
	};
	
	
	o.addSettings = function(id, settings) {
	
	console.log(settings);
  		return $http.post('/sensordefaults', settings).success(function(data){
		console.log(data);
	  });;
	};
	
	o.updateSettings = function(sensor) {
	  return $http.post('/sensors', sensor).success(function(data){
		o.sensors.push(data);
	  });
	}; 
return o;

}]);



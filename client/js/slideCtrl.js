'use strict';

nugNgApp.controller('slideCtrl', [
'$scope','$http','sensorlist','sensor','store',

function ($scope, $http, sensorlist,sensor,store) {
$scope.growState = {
        state: 'grow'
      };
$scope.nugProfile = store.get('nugProfile');

/*
$scope.updateDataObj = function(el,nv) {
console.log(el);
console.log(nv);
el = nv;
}
*/


$scope.saveSettings = function(){
	//console.log($scope.lightObj);
	//console.log($scope.settingsObj);
	
	var dataJson = {
		 "customer_id" : $scope.nugProfile.customerid, 
		"par" : [
			$scope.lightObj
		], 
		"growStates" : 
			$scope.settingsObj
		
	} //dataJson
	
	sensorlist.addSettings(sensor._id,dataJson);
	

};


$scope.beginWatchers = function() {

	//this shouldn't run until we have our data response
	//we turn on our watcher after we have our results
	//todo: promise may be a better way to do this
		
		var gsKey = $scope.gsArr.indexOf($scope.growState.state);
		$scope.$watch('knobsCtrlMaxOffVal', function(newVal) {

    		$scope.settingsObj[gsKey].settings[0].lightsOff.heat[0].max = newVal;
  		})
  		
  		$scope.$watch('knobsCtrlMinOnVal', function(newVal) {
    		
    		$scope.settingsObj[gsKey].settings[0].lightsOn.heat[0].min = newVal;
  		
  		})
  		
  		 $scope.$watch('knobsCtrlMinOffVal', function(newVal) {
    		
    		$scope.settingsObj[gsKey].settings[0].lightsOff.heat[0].min = newVal;
  		
  		})
  		
  		$scope.$watch('knobsCtrlMaxOnVal', function(newVal) {
    		$scope.settingsObj[gsKey].settings[0].lightsOn.heat[0].max = newVal;
  		
  		})
  		
  		 $scope.$watch('knobsCtrlMaxHumOnVal', function(newVal) {
    		
    		$scope.settingsObj[gsKey].settings[0].lightsOn.humidity[0].max = newVal;
    		
  		})
  		
		$scope.$watch('knobsCtrlMinHumOnVal', function(newVal) {
			
			$scope.settingsObj[gsKey].settings[0].lightsOn.humidity[0].min = newVal;

		})
		
		$scope.$watch('knobsCtrlMaxHumOffVal', function(newVal) {
    		
    		$scope.settingsObj[gsKey].settings[0].lightsOff.humidity[0].max = newVal;

  		})
  		
  		 $scope.$watch('knobsCtrlMinHumOffVal', function(newVal) {

    		$scope.settingsObj[gsKey].settings[0].lightsOff.humidity[0].min = newVal;

  		})
  		
  		

};


$scope.setGrowStates= function(){
	//console.log($scope.settingsObj);
	//console.log($scope.gsArr);
	var gsKey = $scope.gsArr.indexOf($scope.growState.state);
	$scope.beginWatchers();
	//console.log("the key is: " +gsKey);
	
	var theSettings = $scope.originalObj[gsKey].settings[0];
	
	//console.log(theSettings);
	
	//light settings
	//note - these are not actually tied to grow state
	//update here for consolidation purposes
	
	var lightsOnArr = theSettings.lightsOn.time.split(":");
	var lightsOffArr = theSettings.lightsOff.time.split(":");
	
	
	console.log(lightsOffArr);
	
	$scope.timepicker.clock.time.fromHour = lightsOnArr[0];
	$scope.timepicker.clock.time.fromMinute = lightsOnArr[1];
	$scope.timepicker.clock.time.toHour = lightsOffArr[0];
	$scope.timepicker.clock.time.toMinute = lightsOffArr[1];
	
	$scope.strLightsOn = theSettings.lightsOn.time;
	$scope.strLightsOff = theSettings.lightsOff.time;
	$scope.strMinParVal = $scope.lightObj.min;
	$scope.strMaxParVal = $scope.lightObj.max;
	$scope.strBlueParVal = $scope.lightObj.blue;
	$scope.strRedParVal = $scope.lightObj.red;
	$scope.parVal = $scope.lightObj.min+";"+$scope.lightObj.max;
    $scope.redVal = $scope.lightObj.red;
    $scope.blueVal = $scope.lightObj.blue;
   
	
	
	
	//temperature settings
	 $scope.strMaxOnVal = theSettings.lightsOn.heat[0].max;
	 $scope.strMaxOffVal = theSettings.lightsOff.heat[0].max;
	 $scope.strMinOnVal = theSettings.lightsOn.heat[0].min;
	 $scope.strMinOffVal = theSettings.lightsOff.heat[0].min;
	 
	 //humidity settings
	 $scope.strMaxHumOnVal = theSettings.lightsOn.humidity[0].max;
	 $scope.strMaxHumOffVal = theSettings.lightsOff.humidity[0].max;
	 $scope.strMinHumOnVal = theSettings.lightsOn.humidity[0].min;
	 $scope.strMinHumOffVal = theSettings.lightsOff.humidity[0].min;

	
	//temperature settings
	 $scope.knobsCtrlMaxOnVal = theSettings.lightsOn.heat[0].max;
	 $scope.knobsCtrlMaxOffVal = theSettings.lightsOff.heat[0].max;
	 $scope.knobsCtrlMinOnVal = theSettings.lightsOn.heat[0].min;
	 $scope.knobsCtrlMinOffVal = theSettings.lightsOff.heat[0].min;
	 
	 //humidity settings
	 $scope.knobsCtrlMaxHumOnVal = theSettings.lightsOn.humidity[0].max;
	 $scope.knobsCtrlMaxHumOffVal = theSettings.lightsOff.humidity[0].max;
	 $scope.knobsCtrlMinHumOnVal = theSettings.lightsOn.humidity[0].min;
	 $scope.knobsCtrlMinHumOffVal = theSettings.lightsOff.humidity[0].min;
 } 


$scope.growStateToggle = function() {
	//console.log("growState");
	$scope.setGrowStates();

};


$scope.sensor = sensor;
	//console.log(sensor);
    
    if (sensor.sensorSettings) {
    //set from sensor
    console.log("this sensor has settings already");
    
    } else {
    	console.log("no settings for this sensor yet");
    	//get company settings
    	
    	console.log("get customer level settings" + $scope.nugProfile.customerid);
    	var durl = "/sensordefaults";
    	$http.get(
		  durl, {
		  params: { customer_id:$scope.nugProfile.customerid }
			}
		).then(function successCallback(response) {
		
     
		console.log(response);
		
		
//		console.log(response.data.par);
		$scope.lightObj = response.data.par[0];
		var settingsObj = response.data.growStates;
		//console.log(settingsObj);
		
		//make it globally available
		$scope.settingsObj = settingsObj;
		$scope.originalObj = settingsObj;
		
		
		
		// there is no guarantee that the growStates will always be in the same order
		// we are going to create a simple array to hold growStates
		// this is then used to find the indexOf growState from the http response
		// so when we choose a different grow state in the form we can pull settings from the correct index
		
		var gsArr = [];
		for (var key in settingsObj) {
			// skip loop if the property is from prototype
			if (!settingsObj.hasOwnProperty(key)) continue;

			var obj = settingsObj[key];
			for (var prop in obj) {
				// skip loop if the property is from prototype
				if(!obj.hasOwnProperty(prop)) continue;

				// set the simple array
				if(prop == "growState") {
				gsArr.push(obj[prop]);
				}
				
				// while we're here, set the index on initial load  
				if(obj[prop] == $scope.growState.state) {
					var gsKey = key;
				}
				
				console.log(prop + " = " + obj[prop]);
			}
		}
		
		$scope.gsArr = gsArr;
		
		
		//console.log(gsArr);
		$scope.setGrowStates();
		$scope.beginWatchers();
		
			// this callback will be called asynchronously
			// when the response is available
		  }, function errorCallback(response) {
			// called asynchronously if an error occurs
			// or server returns response with an error status.
		  });

    	//else get default settings
    	
    
    }
   
//knobs start here


 $scope.knobsCtrlMaxOffVal = 80;
    $scope.knobsCtrlMaxOffOpt = {
      skin: {
        type: 'tron'
      },
      size: 300,
      unit: "°F",
      barWidth: 40,
      bgColor: '#2C3E50',
  	  barColor: '#FFAE1A',
  	  textColor: '#eee',
      
     
      step: 1,
      displayPrevious: true
    };
    
    
    
    
    
    
 $scope.knobsCtrlMinOnVal = 70;
    $scope.knobsCtrlMinOnOpt = {
      
      size: 300,
      unit: "°F",
      barWidth: 40,
      trackColor: 'rgba(33,33,33,.2)',
  	  barColor: 'rgba(255,221,51,1)',
      
      scale: {
        enabled: true,
        type: 'lines',
        width: 3
      },
      step: 1,
      displayPrevious: true,
      displayInput: true
    };
    
      
  
  
    $scope.knobsCtrlMinOffVal = 65;
    $scope.knobsCtrlMinOffOpt = {
      skin: {
        type: 'tron'
      },
      size: 300,
      unit: "°F",
      barWidth: 40,
      bgColor: '#2C3E50',
  	  barColor: '#FFAE1A',
  	  textColor: '#eee',
      
     
      step: 1,
      displayPrevious: true
    };
    
    
     
     
     
     $scope.knobsCtrlMaxOnVal = 90;
     $scope.knobsCtrlMaxOnOpt = {
     size: 300,
     unit: "°F",
      barWidth: 40,
      trackColor: 'rgba(33,33,33,.2)',
  	  barColor: 'rgba(255,221,51,1)',
      
      scale: {
        enabled: true,
        type: 'lines',
        width: 3
      },
      step: 1,
      displayPrevious: true,
      displayInput: true
    };
    
      




 $scope.knobsCtrlMaxHumOnVal = 90;
     $scope.knobsCtrlMaxHumOnOpt = {
     size: 300,
     unit: "%",
      barWidth: 40,
      trackColor: 'rgba(33,33,33,.2)',
  	  barColor: 'rgba(255,221,51,1)',
      
      scale: {
        enabled: true,
        type: 'lines',
        width: 3
      },
      step: 1,
      displayPrevious: true,
      displayInput: true
    };
    
     
  
   $scope.knobsCtrlMinHumOnVal = 90;
     $scope.knobsCtrlMinHumOnOpt = {
     size: 300,
     unit: "%",
      barWidth: 40,
      trackColor: 'rgba(33,33,33,.2)',
  	  barColor: 'rgba(255,221,51,1)',
      
      scale: {
        enabled: true,
        type: 'lines',
        width: 3
      },
      step: 1,
      displayPrevious: true,
      displayInput: true
    };
    
    
  
  $scope.knobsCtrlMaxHumOffVal = 65;
    $scope.knobsCtrlMaxHumOffOpt = {
      skin: {
        type: 'tron'
      },
      size: 300,
      unit: "%",
      barWidth: 40,
      bgColor: '#2C3E50',
  	  barColor: '#FFAE1A',
  	  textColor: '#eee',
      
     
      step: 1,
      displayPrevious: true
    };
    
    
  
    $scope.knobsCtrlMinHumOffVal = 65;
    $scope.knobsCtrlMinHumOffOpt = {
      skin: {
        type: 'tron'
      },
      size: 300,
      unit: "%",
      barWidth: 40,
      bgColor: '#2C3E50',
  	  barColor: '#FFAE1A',
  	  textColor: '#eee',
      
     
      step: 1,
      displayPrevious: true
    };
    
    
     


	
    
    //sliders start here
    
    
    
    
    
    
    $scope.idPar = "par";			
    $scope.parVal = "800;1380";
    $scope.idBlue = "bluePeak";			
    $scope.blueVal = 453;
    $scope.idRed = "redPeak";			
    $scope.redVal = 600;
    
    $scope.disable = function() {
        $scope.disabled = !$scope.disabled;
    };	
    
       $scope.parOpt = {				
        from: 500,
        to: 2000,
        floor: false,
        step: 1,
        dimension: ' nm',
        vertical: false,
        callback: function(value, elt) {
            //console.log(value);
            
            var valArr = value.split(";");
            //console.log(elt);
            $scope.lightObj.min = valArr[0];
            $scope.lightObj.max = valArr[1];
            //console.log($scope.lightObj);
        }				
    };
    
     $scope.blueOpt= {				
        from: 100,
        to: 1000,
        floor: true,
        step: 1,
        dimension: " nm",
        skin: 'blue',
        css: {
            background: {"background-color": "blue"},
            before: {"background-color": "gray"},
            default: {"background-color": "white"},
            after: {"background-color": "gray"},
            pointer: {"background-color": "white"}
        },
        vertical: false,
        callback: function(value, elt) {
            //console.log(value);
             $scope.lightObj.blue = value;
            
        }				
    };
		 
	$scope.redOpt= {				
        from: 100,
        to: 1000,
        floor: true,
        step: 1,
        dimension: " nm",
        skin: 'red',
        css: {
            background: {"background-color": "red"},
            before: {"background-color": "gray"},
            default: {"background-color": "white"},
            after: {"background-color": "gray"},
            pointer: {"background-color": "black"}
        },
        vertical: false,
        callback: function(value, elt) {
           // console.log(value);
           
             $scope.lightObj.red = value;
        }				
    };



//TIMEPICKER


$scope.timepicker = {
		clock: {
			dropdownToggleState: false,
			time: {
				format: 24,
				theme: 'dark'
			}
		}	
	};
	$scope.onApplyTimePicker = function () {
	
		var gsKey = $scope.gsArr.indexOf($scope.growState.state);
		var lightsOn = $scope.timepicker.clock.time.fromHour + ":" + $scope.timepicker.clock.time.fromMinute;
		
		var lightsOff = $scope.timepicker.clock.time.toHour + ":" + $scope.timepicker.clock.time.toMinute;
		$scope.settingsObj[gsKey].settings[0].lightsOn.time = lightsOn;
		$scope.settingsObj[gsKey].settings[0].lightsOff.time = lightsOff;
		
//		console.log(lightsOff);
//		console.log($scope.timepicker.clock.time);
	};
	$scope.onClearTimePicker = function () {
		console.log('time range reset');
	};
	
	
//END TIMEPICKER



   
    
 
   
    
}
]);

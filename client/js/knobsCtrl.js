'use strict';

nugNgApp.controller('knobsCtrl', ['$scope', '$http', function($scope, $http) {

  var init = function() {


	
     

  };







  init();
  
  

}])



nugNgApp.controller('knobsCtrlMinOn', function ($scope) {
    
 $scope.value = 70;
    $scope.options = {
      
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
    
      $scope.$watch('value', function(newVal) {
    console.log('new value is ', newVal);
  })
})


nugNgApp.controller('knobsCtrlMinOff', function ($scope) {
    
    
    $scope.value = 65;
    $scope.options = {
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
    
     $scope.$watch('value', function(newVal) {
    console.log('new value is ', newVal);
  })
    
    
    
  })
  
  
  nugNgApp.controller('knobsCtrlMaxOn', function ($scope) {
    
    
     $scope.value = 90;
     $scope.options = {
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
    
      $scope.$watch('value', function(newVal) {
    console.log('new value is ', newVal);
  })
})
  
  
  nugNgApp.controller('knobsCtrlMaxOff', function ($scope) {
    
    
    $scope.value = 80;
    $scope.options = {
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
    
    
    
     $scope.$watch('value', function(newVal) {
    console.log('new value is ', newVal);
  })
    
  })

    
  
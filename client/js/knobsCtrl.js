'use strict';

nugNgApp.controller('knobsCtrl', ['$scope', '$http', function($scope, $http) {

  var init = function() {


	
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
    
    
    
     $scope.$watch('knobsCtrlMaxOffVal', function(newVal) {
    console.log('new value is ', newVal);
  })
    
    
    
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
    
      $scope.$watch('knobsCtrlMinOnVal', function(newVal) {
    console.log('new value is ', newVal);
  })
  
  
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
    
     $scope.$watch('knobsCtrlMinOffVal', function(newVal) {
    console.log('new value is ', newVal);
  })
     
     
     
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
    
      $scope.$watch('knobsCtrlMaxOnVal', function(newVal) {
    console.log('new value is ', newVal);
  })

  }; //init







  init();
  
  

}])



  
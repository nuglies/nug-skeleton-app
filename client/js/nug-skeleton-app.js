  'use strict';

  var nugNgApp = angular.module('nug-skeleton-app', [
    'ui.router','nouislider'
  ]);

  nugNgApp.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('dashboard', {
        url: '/dashboard',
        templateUrl: 'partials/dashboard.html',
        controller: 'dashboardCtrl'
      })
      .state('settings', {
        url: '/settings',
        templateUrl: 'partials/settings.html',
        controller: 'settingsCtrl'
      })
      .state('sensors', {
        url: '/sensors',
        templateUrl: 'partials/sensors.html',
        controller: 'sensorsCtrl'
      });

      
      
      
      
  });

  nugNgApp
    .controller('main-controller', ['$scope', function($scope) {
      $scope.hello = 'world';
    }]);

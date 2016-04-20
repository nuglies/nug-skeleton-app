  'use strict';

  var nugNgApp = angular.module('nug-skeleton-app', [
    'ui.router','ui.knob'
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
    .state('knobs', {
        url: '/knobs',
        templateUrl: 'partials/knobs.html',
        controller: 'knobsCtrl'
      });
  });

  nugNgApp
    .controller('main-controller', ['$scope', function($scope) {
      $scope.hello = 'world';
    }]);

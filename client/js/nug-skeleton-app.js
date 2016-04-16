  'use strict';

  var nugNgApp = angular.module('nug-skeleton-app', [
    'ui.router'
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
      });
  });

  nugNgApp
    .controller('main-controller', ['$scope', function($scope) {
      $scope.hello = 'world';
    }]);

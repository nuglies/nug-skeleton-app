  'use strict';

  var nugNgApp = angular.module('nug-skeleton-app', [
    'ui.router'
  ]);

  nugNgApp.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('dashboard', {
        url: "/dashboard",
        templateUrl: "partials/dashboard.html"
      })
      .state('settings', {
        url: "/state2",
        templateUrl: "partials/settings.html"
      });
  });

  nugNgApp
    .controller('main-controller', ['$scope', function($scope) {
      $scope.hello = 'world';
    }]);

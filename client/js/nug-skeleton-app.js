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
      .controller(
          'main-controller', ['$log', '$scope', '$rootScope', '$http', '$location', '$window',
              function($log, $scope, $rootScope, $http, $location, $window) {
                  console.log('main controller');
                  $http.get('/checkLoggedIn').then(
                      function() {
                          $log.debug('user is authenticate');
                          $rootScope.isLoggedIn = true;
                      },
                      function(error) {
                          $log.info('user is not authenticated, show modal', error);
                          $rootScope.isLoggedIn = false;
                      }
                  );

                  var twitterLoginURL = 'https://nugs.auth0.com/authorize?response_type=code&scope=openid%20profile&client_id=TdtdYCDQHSR3TtNgsMuCXHfjHDyxMsmB&redirect_uri=http://localhost:3000/auth0Callback&connection=twitter';

                  $scope.twitterLogin = function() {
                      $log.debug('doing twitter login');
                      $window.location.href = twitterLoginURL
                  };

                  $scope.googleLogin = function() {
                      $log.debug('doing google login');
                  };

                  $scope.facebookLogin = function() {
                      $log.debug('doing facebook login');
                  };

                  $scope.hello = 'world';
              }
          ]);

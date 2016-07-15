  'use strict';

  var nugNgApp = angular.module('nug-skeleton-app', [
      'ui.router'
  ]);

  nugNgApp.config(function($stateProvider, $urlRouterProvider) {
      $urlRouterProvider.otherwise('/welcome')

      $stateProvider
          .state('dashboard', {
              url: '/dashboard',
              templateUrl: 'partials/dashboard.html',
              controller: 'dashboardCtrl'
          })
          .state('settings', {
              url: '/settings',
              templateUrl: 'partials/settings.html'
          })
          .state('welcome', {
              url: '/welcome',
              templateUrl: 'partials/welcome.html',
              controller: 'welcomeCtrl'
          })
  });

  nugNgApp.controller(
      'main-controller', ['$log', '$scope', '$rootScope', '$http', '$location', '$window', '$state',
          function($log, $scope, $rootScope, $http, $location, $window, $state) {

              console.log('main controller');
              console.log('hash', $window.location.hash.substr(2))

              // Controller initializes...
              var hash = $window.location.hash.substr(2)

              if (hash.length && hash.indexOf('access_token') > -1) {
                  console.log('handling auth0 redirect')
                  $http.post('/auth0Callback?' + hash).then(
                      function(response) {
                          console.log('got response back from auth0cb', response)
                          $rootScope.loggedInUser = response.data;
                          $rootScope.isLoggedIn = true;
                          $state.go('welcome')
                      },
                      function(err) {
                          console.log('got err from auth0cb', err)
                      }
                  )
              } else {
                  $http.get('/checkLoggedIn').then(
                      function(response) {
                          $log.debug('user is authenticated');
                          $rootScope.isLoggedIn = true;
                          $rootScope.loggedInUser = response.data;
                      },
                      function(error) {
                          $log.info('user is not authenticated, show modal', error);
                          $rootScope.isLoggedIn = false;
                      }
                  );
              }

              var authUrl = 'https://nugs.auth0.com/authorize/?response_type=token&client_id=TdtdYCDQHSR3TtNgsMuCXHfjHDyxMsmB&redirect_uri=##REDIRECT_TO##&state=VALUE_THAT_SURVIVES_REDIRECTS&scope=openid'
              var redirectTo = $window.location.protocol + $window.location.hostname + '/'
              console.log('will redirect to ', redirectTo)

              $scope.twitterLogin = function() {
                  $log.debug('doing twitter login');
                  $window.location.href = authUrl.replace('##REDIRECT_TO##', redirectTo) + '&connection=twitter';
              };

              $scope.googleLogin = function() {
                  $log.debug('doing google login');
                  $window.location.href = authUrl.replace('##REDIRECT_TO##', redirectTo) + '&connection=google-oauth2';
              };

              $scope.facebookLogin = function() {
                  $log.debug('doing facebook login');
                  $window.location.href = authUrl.replace('##REDIRECT_TO##', redirectTo) + '&connection=facebook';
              };

              $scope.hello = 'world';
          }
      ]);


  nugNgApp.controller('auth0Ctrl', ['$log', '$scope', '$rootScope', '$http', '$location', '$window',
      function($log, $scope, $rootScope, $http, $location, $window) {
          console.log('auth0 controller')
      }
  ]);


  nugNgApp.controller('welcomeCtrl', ['$log', '$scope', '$rootScope', '$http', '$location', '$window',
      function($log, $scope, $rootScope, $http, $location, $window) {
          console.log('welcome controller')
          $scope.displayName = $rootScope.loggedInUser ?  $rootScope.loggedInUser.nickname || $rootScope.loggedInUser.given_name : 'unknown';
          $scope.picURL = $rootScope.loggedInUser ? $rootScope.loggedInUser.picture : 'pics/unknown.png';
      }
  ]);

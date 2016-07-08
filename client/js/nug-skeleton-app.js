  'use strict';

  var nugNgApp = angular.module('nug-skeleton-app', [
    'ui.router','auth0', 'angular-storage', 'angular-jwt','ngCookies', 'ui.knob','angularAwesomeSlider','wingify.timePicker'
  ]);

  nugNgApp.config(function($stateProvider, $urlRouterProvider, $httpProvider, authProvider, jwtInterceptorProvider) {
    $stateProvider
      .state('dashboard', {
        url: '/dashboard',
        templateUrl: 'partials/dashboard.html',
        controller: 'dashboardCtrl',
        data: {
     		requiresLogin: true
   		}
      })
      .state('register', {
        url: '/register',
        templateUrl: 'partials/register.html',
        controller: 'registerCtrl',
        data: {
     		requiresLogin: true
   		}
      })
      .state('slider', {
      url: '/slider/{id}',
      templateUrl: 'partials/slider.html',
      controller: 'slideCtrl',
      resolve: {
		sensor: ['$stateParams', 'sensorlist', function($stateParams, sensorlist) {
		  return sensorlist.get($stateParams.id);
			}],
			/*
		sensorsettings: ['$stateParams', 'sensorlist', function($stateParams, sensorlist) {
		  return sensorlist.getSettings($stateParams.id);
			}],
			*/

		}
    })
      .state('settings', {
        url: '/settings',
        templateUrl: 'partials/settings.html',
        controller: 'settingsCtrl',
         data: {
     		requiresLogin: true
   		}
      })
      .state('sensor', {
      url: '/sensor/{id}',
      templateUrl: 'partials/sensor.html',
      controller: 'sensorCtrl',
      resolve: {
		sensor: ['$stateParams', 'sensorlist', function($stateParams, sensorlist) {
		  return sensorlist.get($stateParams.id);
			}],


		}
    })
	  .state('login', {
		url: '/login',
		templateUrl: 'partials/login.html',
		controller: 'loginCtrl'
	  })

	;



  	//used for Auth0

		authProvider.init({
		domain: 'nugs.auth0.com',
		clientID: 'TdtdYCDQHSR3TtNgsMuCXHfjHDyxMsmB',
		callbackURL: location.href,
    	// Here include the URL to redirect to if the user tries to access a resource when not authenticated.
    	loginUrl: '/login',
    	loginState: 'login'

		});

	authProvider.on('loginSuccess', function($location, profilePromise, idToken, store) {
	  //console.log("Login Success");
	  profilePromise.then(function(profile) {
		store.set('profile', profile);
	//	console.log(profile.identities[0].user_id);

		store.set('token', idToken);

	  });


	  $location.path('/dashboard');




	});


	authProvider.on('loginFailure', function() {
	   // Error Callback
	});

  jwtInterceptorProvider.tokenGetter = ['store', function(store) {
    // Return the saved token
    return store.get('token');
    //console.log(store);
  }];

  $httpProvider.interceptors.push('jwtInterceptor');


  })


  .run(function($rootScope, auth, store, jwtHelper, $location) {
  // This events gets triggered on refresh or URL change
  $rootScope.$on('$locationChangeStart', function() {



    var token = store.get('token');
    if (token) {
      if (!jwtHelper.isTokenExpired(token)) {
        if (!auth.isAuthenticated) {
          auth.authenticate(store.get('profile'), token);
        }
      } else {
        // Either show the login page or use the refresh token to get a new idToken
        $location.path('/');
      }
    }
  }); //rootscope

  }) //run
 .run(function(auth) {
  // This hooks all auth events to check everything as soon as the app starts
  auth.hookEvents();
})

;

  nugNgApp
    .controller('main-controller', ['$scope', function($scope) {
      $scope.hello = 'world';

    }]);





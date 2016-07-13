'use strict';

nugNgApp.controller('settingsCtrl', ['$scope', '$http', '$cookies', 'sensorlist', 'store', 'asyncSensors', '$log',
    function($scope, $http, $cookies, sensorlist, store, asyncSensors, log) {

        $scope.nugProfile = store.get('nugProfile') || [];
        log.debug('nugProfile', nugProfile);
        var customerid
        if ($scope.nugProfile && $scope.nugProfile[0] && $scope.nugProfile[0].customer_id) {
            customerid = $scope.nugProfile[0].customer_id;
        } else {
            $log.debug('you have no nug profile')
            customerid = 0
        }

        console.log("customerid:" + customerid);

        asyncSensors.getSensorsForCompany(customerid).then(function(sensorData) {
            $scope.sensorlist = sensorData;

            console.log($scope.sensorlist);

        });

        $scope.addSensor = function() {
            if (!$scope.sensorName || $scope.sensorName === '') {
                return;
            }
            sensorlist.create({
                sensorName: $scope.sensorName,
                strain: $scope.strain,
                growState: $scope.growState,
                customerid: $scope.nugProfile[0].customer_id
            });
            $scope.sensorName = '';
            $scope.strain = '';
            //$scope.sensorlist = asyncSensors.getSensorsForCompany($scope.nugProfile[0].customer_id);








            asyncSensors.getSensorsForCompany($scope.nugProfile[0].customer_id).then(function(sensorData) {

                $scope.sensorlist = sensorData;

            });

        }; //addSensor








        var init = function() {
            // just stick some data on scope
            $scope.now = moment().format("dddd, MMMM Do YYYY, h:mm:ss a");
        };

        init();

    }
])


nugNgApp.factory('asyncSensorSettings', function($q, $http) {





    console.log("asyncSensorSettings");



    var getSettingsForCompany = function(customerid) {
        console.log(customerid);
        var deferred = $q.defer();


        var durl = "/sensordefaults";
        $http.get(
            durl, {
                params: {
                    customer_id: customerid
                }
            }
        ).then(function successCallback(response) {
            console.log("success response");
            console.log(response);
            deferred.resolve(response);



        }, function errorCallback(response) {

            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });




        return deferred.promise;
    };
    //console.log(getMessages);
    return {
        getSettingsForCompany: getSettingsForCompany
    };

});

nugNgApp.factory('asyncSensors', function($q, $http) {








    var getSensorsForCompany = function(customerid) {
        var deferred = $q.defer();


        var durl = "/sensors";

        $http.get(

            durl, {
                params: {
                    customerid: customerid
                }
            }
        ).then(function(res) {
            //console.log("asynch data back");
            //console.log(res.data);

            //first we check whether this user exists in our records

            deferred.resolve(res.data);

            //    return res.data;
        });


        return deferred.promise;
    };
    //console.log(getMessages);
    return {
        getSensorsForCompany: getSensorsForCompany
    };

});


nugNgApp.factory('sensorlist', ['$http', function($http) {

    var o = {
        sensors: [],
        sensorsettings: []
    };

    o.get = function(id) {
        return $http.get('/sensors/' + id).then(function(res) {

            //console.log(res.data);
            return res.data;
        });
    };

    o.edit = function(sensor) {
        return $http.post('/sensorupdate/', sensor).then(function(res) {

            //console.log(res.data);
            return res.data;
        });
    };

    o.getAll = function(customerid) {
        //console.log("inside sensorlist");
        //console.log(customerid);
        return $http.get('/sensors').success(function(data) {
            angular.copy(data, o.sensors);
            //console.log("posts data");
            // console.log(data);
        });
    };

    o.getSettings = function(id) {

        return $http.get('/sensors/' + id + '/sensorsettings/').success(function(data) {
            angular.copy(data, o.sensorsettings);
            //console.log("posts data");
            //console.log(data);
        });

    };

    o.create = function(sensor) {

        //console.log("sensor create");
        return $http.post('/sensors', sensor).success(function(data) {
            o.sensors.push(data);
        });
    };


    o.addSettings = function(id, settings) {

        return $http.post('/sensordefaults', settings).success(function(data) {
            console.log(data);
        });;
    };

    o.updateSettings = function(sensor) {
        return $http.post('/sensors', sensor).success(function(data) {
            o.sensors.push(data);
        });
    };
    return o;

}]);

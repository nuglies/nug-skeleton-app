'use strict';

nugNgApp.controller('dashboardCtrl', ['$scope', '$http',
    function($scope, $http) {

        var init = function() {
            $scope.timeAgo = "";

            function formatTimeAgo(dateDiff) {
                var date = new Date(dateDiff);
                var str = 'Last update ';
                str += date.getUTCDate() - 1 + " days ";
                str += date.getUTCHours() + " hours ";
                str += date.getUTCMinutes() + " minutes ";
                str += date.getUTCSeconds() + " seconds ";
                //    str += date.getUTCMilliseconds() + " millis";
                str += "ago";
                return str;
            }
        };

        init();
    }
])

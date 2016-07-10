nugNgApp
    .directive('healthChart', function () {
        return {
            restrict: 'E',
            scope: {
                chartdata: '=chartData',
                stages: '=stages',
                msg: "=hello"

            },
            templateUrl: '/partials/health-chart.html'
        };




    });

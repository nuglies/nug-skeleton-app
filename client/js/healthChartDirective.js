nugNgApp
    .directive('healthChart', function () {
        return {
            restrict: 'E',
            /*
            scope: {
                chartdata: '=chartData',
                stages: '=stages',
                msg: "=hello"

            },
            */
            scope: true,
            templateUrl: '/partials/health-chart.html'
        };




    });

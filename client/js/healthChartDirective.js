nugNgApp
    .directive('healthChart', function () {
        return {
            restrict: 'E',
            scope: {
                chartdata: '=chartData'
            },
            templateUrl: '/partials/health-chart.html'
        };

    });

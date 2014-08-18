var app = angular.module('chartApp', ['PotHoleChartController'])

app.controller('PotHoleChartController', ['$scope',
  function($scope) {
    $scope.data = [];

    $scope.dates = [];

    $scope.options = {
      axes: {
        x: {
          key: 'x',
          labelFunction: function(value) {
            return $scope.dates[value];
          },
          type: 'linear'
        },
        y: {
          type: 'linear',
          min: 0,
          max: 400
        },
        y2: {
          type: 'linear',
          min: 0,
          max: 400
        }
      },
      series: [{
        y: 'report',
        color: 'red',
        thickness: '2px',
        label: 'Reported'
      }, {
        y: 'patch',
        axis: 'y2',
        color: 'green',
        type: 'area',
        striped: true,
        visible: false,
        drawDots: true,
        label: 'Patched'
      }],
      lineMode: 'linear',
      tension: 0.7,
      tooltip: {
        mode: 'scrubber',
        formatter: function(x, y, series) {
          return y;
        }
      },
      drawLegend: true,
      drawDots: true,
      columnsHGap: 5
    }
  }
]);

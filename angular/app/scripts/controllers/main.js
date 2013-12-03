'use strict';

angular.module('angularApp').controller(
  'MainCtrl',
  ['$scope', 'Player', function ($scope, Player) {
    $scope.player = Player;
    $scope.player();
  }]);

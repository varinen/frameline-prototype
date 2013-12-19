'use strict';

angular.module('angularApp').controller('NavbarCtrl',
  [
    '$scope',
    '$location',
    function ($scope, $location) {
      $scope.routeIs = function(routeName) {
        return $location.path() === routeName;
      };
    }
  ]
);
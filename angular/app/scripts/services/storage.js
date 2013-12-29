'use strict';

var storageService = angular.module('storageService', ['ngResource']);

storageService.factory('ScriptList', ['$resource', '$http',
function($resource, $http) {
  $http.defaults.useXDomain = true;
  return $resource(
    'http://dev.frameline.dev/server/index.php?action=:action&filename=:filename',
    {action:"@action", filename:"@filename"}
  );
}
]);
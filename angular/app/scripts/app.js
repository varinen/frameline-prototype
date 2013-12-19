'use strict';

angular.module('angularApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.bootstrap',
  'ngRoute',
  'playerService',
  'playerControlsService',
  'scriptParserService',
  'commandsDictionaryService',
  'scriptService'
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/editor', {
        templateUrl: 'views/editor.html',
        controller: 'EditorCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
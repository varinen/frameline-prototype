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
  'scriptService',
  'editorCommands',
  'storageService'
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/player', {
        templateUrl: 'views/player.html',
        controller: 'PlayerCtrl'
      })
      .when('/editor', {
        templateUrl: 'views/editor.html',
        controller: 'EditorCtrl'
      })
      .when('/joker', {
        templateUrl: 'views/player.html',
        controller: 'JokerCtrl'
      })
      .when('/quotes', {
        templateUrl: 'views/player.html',
        controller: 'QuotesCtrl'
      })
      .when('/starwars', {
        templateUrl: 'views/player.html',
        controller: 'StarwarsCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
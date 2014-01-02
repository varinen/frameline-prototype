'use strict';
angular.module('editorCommands', []);

angular.module('editorCommands')
  .directive('startscript', function () {
    return {
      scope: {commandObject: '=commandobject', commandsDictionary: '=commandsdictionary', setDropDownValue: '=setdropdownvalue'},
      templateUrl: '/views/directives/start_script.html',
      restrict: 'E'
    };
  });

angular.module('editorCommands')
  .directive('setvolume', function () {
    return {
      scope: {commandObject: '=commandobject', commandsDictionary: '=commandsdictionary'},
      templateUrl: '/views/directives/set_volume.html',
      restrict: 'E'
    };
  });

angular.module('editorCommands')
  .directive('setanchor', function () {
    return {
      scope: {commandObject: '=commandobject', commandsDictionary: '=commandsdictionary'},
      templateUrl: '/views/directives/set_anchor.html',
      restrict: 'E'
    };
  });

angular.module('editorCommands')
  .directive('seekto', function () {
    return {
      scope: {commandObject: '=commandobject', commandsDictionary: '=commandsdictionary'},
      templateUrl: '/views/directives/seek_to.html',
      restrict: 'E'
    };
  });

angular.module('editorCommands')
  .directive('play', function () {
    return {
      scope: {commandObject: '=commandobject', commandsDictionary: '=commandsdictionary'},
      templateUrl: '/views/directives/play.html',
      restrict: 'E'
    };
  });

angular.module('editorCommands')
  .directive('pause', function () {
    return {
      scope: {commandObject: '=commandobject', commandsDictionary: '=commandsdictionary'},
      templateUrl: '/views/directives/pause.html',
      restrict: 'E'
    };
  });

angular.module('editorCommands')
  .directive('loadvideo', function () {
    return {
      scope: {commandObject: '=commandobject', commandsDictionary: '=commandsdictionary', setDropDownValue: '=setdropdownvalue'},
      templateUrl: '/views/directives/load_video.html',
      restrict: 'E'
    };
  });
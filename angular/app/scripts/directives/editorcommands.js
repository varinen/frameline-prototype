'use strict';
angular.module('editorCommands', []);

angular.module('editorCommands')
  .directive('startscript', function () {
    return {
      scope: {commandObject: '=commandobject', commandsDictionary: '=commandsdictionary', setDropDownValue: '=setdropdownvalue'},
      templateUrl: '/views/directives/start_script.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        var b  = 1;
        //element.text('this is a chart');
      }
    }
  });

angular.module('editorCommands')
  .directive('setvolume', function () {
    return {
      scope: {commandObject: '=commandobject', commandsDictionary: '=commandsdictionary'},
      templateUrl: '/views/directives/set_volume.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        var b  = 1;
        //element.text('this is a chart');
      }
    };
  });
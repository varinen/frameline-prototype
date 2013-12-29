'use strict';
angular.module('editorCommands', []);

angular.module('editorCommands')
  .directive('startscript', function () {
    return {
      templateUrl: '/views/directives/start_script.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        //element.text('this is a chart');
      }
    };
  });

angular.module('editorCommands')
  .directive('setvolume', function () {
    return {
      scope: {commandObject: '=commandobject'},
      templateUrl: '/views/directives/set_volume.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        scope.currentcommandid = attrs.currentcommandid;
        var b  = 1;
        //element.text('this is a chart');
      }
    };
  });
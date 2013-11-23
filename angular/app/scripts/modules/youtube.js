'use strict';
angular.module('ytdirectives', []);
angular.module('ytdirectives')
.directive('youtube', function() {
  return {
    restrict: 'E',
    templateUrl: 'views/directives/youtube.html',
    link: function (scope, element, attrs) {
      element[0].innerHTML = element[0].innerHTML.replace('%url%', 'http://www.youtube.com/embed/' + attrs.code);
    }
  };
});



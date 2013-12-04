'use strict';
var YT, callPlayer;

angular.module('angularApp').controller(
  'MainCtrl',
  ['$scope', 'Player', function ($scope, Player) {

    var playerElementId = 'player';

    $scope.loadVideo = {
      'id': 'Zs6udGtMLS0',
      'quality': 'default'
    };
    var onPlayerReady = function (event) {
      event.target.playVideo();
    };

    var done = false;
    var onPlayerStateChange = function (event) {
      if (event.data === YT.PlayerState.PLAYING && !done) {
        setTimeout(function() {callPlayer(playerElementId, 'stopVideo');}, '6000');
        done = true;
      }
    };

    $scope.playerFactory = Player;
    $scope.player = $scope.playerFactory().getPlayer(
      {
        'target': playerElementId,
        'events':{
          'onReady': onPlayerReady,
          'onStateChange': onPlayerStateChange
        }
      }
    );

    $scope.pause = function() {
      callPlayer(playerElementId, 'pauseVideo');
    };

    $scope.loadVideoById = function() {
      callPlayer(playerElementId, 'loadVideoById', [$scope.loadVideo.id, 0, $scope.loadVideo.quality]);
    };
  }]);

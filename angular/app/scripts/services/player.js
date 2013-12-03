'use strict';

var YT, playerService = angular.module('playerService', []);

playerService.factory('Player', function() {
  return function() {
    var onPlayerReady = function (event) {
      event.target.playVideo();
    };

    var done = false;
    var onPlayerStateChange = function (event) {
      if (event.data === YT.PlayerState.PLAYING && !done) {
        setTimeout(stopVideo, 6000);
        done = true;
      }
    };

    var player = new YT.Player('player', {
      height: '390',
      width: '640',
      videoId: 'sdv_TbmA3CM',
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
      }
    });

    var stopVideo = function () {
      player.stopVideo();
    };
    return player;
  };
});
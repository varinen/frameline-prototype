'use strict';

var YT, playerService = angular.module('playerService', []);

playerService.factory('Player', function() {
  return function() {
    return {
      getPlayer: function(config) {
        var target  = config.target || 'player';
        var height  = config.height || '390';
        var width   = config.width || '640';
        var videoId = config.videoId || 'sdv_TbmA3CM';
        var events  = config.events || {};
        return new YT.Player(target, {
          height: height,
          width: width,
          videoId: videoId,
          events: events
        });
      }
    };
  };
});
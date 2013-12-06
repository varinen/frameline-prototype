'use strict';

var playerControlsService = angular.module('playerControlsService', []);

playerControlsService.factory('PlayerControls',
  function() {
  return function() {
    return {
      getControls: function(callPlayer, playerElementId) {
        var statusData = {};
        return {
          startListening: function() {
            callPlayer(playerElementId, 'listening');
            window.addEventListener(
              'message',
              this.interpretMessages,
              true
            );
          },
          interpretMessages: function(e) {
            var data = JSON.parse(e.data);
            if (
              ((e.origin === 'http://www.youtube.com') || (e.origin === 'https://www.youtube.com')) &&
                (data.event === 'infoDelivery')) {
              for (var property in data.info) {
                if (data.info.hasOwnProperty(property)) {
                  statusData[property] = data.info[property];
                }
              }
              //console.log(statusData);
            }
          },
          getStatusData: function() {
            return statusData;
          },
          getCurrentTime: function() {
            return statusData.currentTime;
          },
          playVideo: function() {
            callPlayer(playerElementId, 'playVideo');
          },
          stopVideo: function() {
            callPlayer(playerElementId, 'stopVideo');
          },
          pause: function() {
            callPlayer(playerElementId, 'pauseVideo');
          },
          loadVideoById: function(loadVideoArgs) {
            callPlayer(
              playerElementId,
              'loadVideoById',
              [
                loadVideoArgs.id,
                loadVideoArgs.startSeconds || 0 ,
                loadVideoArgs.quality || 'default'
              ]
            );
          }
        };
      }
    };
  };
});
'use strict';

var playerControlsService = angular.module('playerControlsService', []);

playerControlsService.factory('PlayerControls',
  function() {
  return function() {
    return {
      getControls: function(callPlayer, playerElementId) {
        var statusData = {};
        var listeners = [];
        return {
          addListener: function(listener) {
            listeners.push(listener);
          },
          startListening: function() {
            callPlayer(playerElementId, 'listening');
            window.addEventListener(
              'message',
              this.interpretMessages,
              true
            );
          },
          interpretMessages: function(e) {
            var i, property, data = JSON.parse(e.data);
            if (
              ((e.origin === 'http://www.youtube.com') || (e.origin === 'https://www.youtube.com')) &&
                (data.event === 'infoDelivery')) {
              for (property  in data.info) {
                if (data.info.hasOwnProperty(property)) {
                  statusData[property] = data.info[property];
                }
              }
              for (i = 0; i < listeners.length; i += 1) {
                listeners[i](statusData);
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
                loadVideoArgs.quality || 'default',
              ]
            );
          },
          setVolume: function(volume) {
            volume = parseInt(volume);
            if (volume < 0) {
              volume = 0;
            }
            if (volume > 100) {
              volume = 100;
            }
            callPlayer(playerElementId, 'setVolume', [volume]);
          },

          changeVolume: function(change) {
            var volume = statusData.volume + change;
            this.setVolume(volume);
          },

          setPlaybackRate: function(rate) {
            return callPlayer(playerElementId, 'setPlaybackRate', [rate]);
          },

          getAvailablePlaybackRates: function() {
            return callPlayer(playerElementId, 'getAvailablePlaybackRates');
          },

          seekTo: function(sec) {
            sec = parseFloat(sec);
            if (parseFloat(sec) > statusData.duration) {
              sec = statusData.duration;
            }
            if (sec < 0) {
              sec = 0;
            }
            callPlayer(playerElementId, 'seekTo', [sec]);
          },

          setPlaybackQuality: function(quality) {
            callPlayer(playerElementId, 'setPlaybackQuality', [quality]);
          }
        };
      }
    };
  };
});
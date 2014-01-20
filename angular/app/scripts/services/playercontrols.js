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
          startScript: function(args) {
            this.loadVideoById({'id': args.id, 'startSeconds': args.startSecond, 'quality': args.quality});
            this.playVideo();
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
          stop: function() {
            callPlayer(playerElementId, 'stopVideo');
          },
          pauseVideo: function() {
            callPlayer(playerElementId, 'pauseVideo');
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
          },
          loadVideo: function(loadVideoArgs) {
            callPlayer(
              playerElementId,
              'loadVideoById',
              [
                loadVideoArgs.id,
                loadVideoArgs.startSecond || 0 ,
                loadVideoArgs.quality || 'default'
              ]
            );
          },
          setVolume: function(args) {
            var volume = parseInt(args.volume);
            if (volume < 0) {
              volume = 0;
            }
            if (volume > 100) {
              volume = 100;
            }
            callPlayer(playerElementId, 'setVolume', [volume]);
          },

          changeVolume: function(args) {
            var volume = statusData.volume + args.change;
            this.setVolume({'volume': volume});
          },

          setPlaybackRate: function(args) {
            return callPlayer(playerElementId, 'setPlaybackRate', [args.rate]);
          },

          getAvailablePlaybackRates: function() {
            return callPlayer(playerElementId, 'getAvailablePlaybackRates');
          },

          seekTo: function(args) {
            var position = parseFloat(args.position);
            if (parseFloat(position) > statusData.duration) {
              position = statusData.duration;
            }
            if (position < 0) {
              position = 0;
            }
            callPlayer(playerElementId, 'seekTo', [position]);
          },

          setPlaybackQuality: function(args) {
            callPlayer(playerElementId, 'setPlaybackQuality', [args.quality]);
          }
        };
      }
    };
  };
});
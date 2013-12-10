'use strict';
var callPlayer;

angular.module('angularApp').controller(
  'MainCtrl',
  ['$scope', 'Player', 'PlayerControls', 'ScriptParser', function ($scope, Player, PlayerControls, ScriptParser) {

    var playerElementId = 'player';

    $scope.volumeStatus = {'muteLabel': 'Mute', 'label': '0', 'volume': 0};
    $scope.pauseState = 'Pause';
    $scope.playbackRate = 0;
    $scope.playbackRates = [0.25, 0.5, 1, 1.5, 2];
    $scope.currentRate = 1;
    $scope.duration = 0;
    $scope.seekToSec = 0;
    $scope.script = {'result': ''};

    $scope.loadVideo = {
      'id': 'JtbDDqU3dVI',
      'quality': 'default'
    };

    $scope.playerFactory = Player;
    $scope.player = $scope.playerFactory().getPlayer(
      {
        'target': playerElementId,
        'videoId': 'sdv_TbmA3CM',
        'events':{
          'onReady': function (event) {event.target.playVideo();}
        }
      }
    );
    $scope.playerControlFactory = PlayerControls;
    $scope.playerControls = $scope.playerControlFactory().getControls(callPlayer, playerElementId);
    $scope.playerControls.startListening();

    $scope.parserFactory = ScriptParser;
    $scope.parser = $scope.parserFactory();

    $scope.togglePause = function() {
      var statusData = $scope.playerControls.getStatusData();
      //if paused
      if (statusData.playerState === 1) {
        $scope.playerControls.pause();
        $scope.pauseState = 'Paused';
      } else {
        $scope.playerControls.playVideo();
        $scope.pauseState = 'Pause';

      }
    };

    $scope.volumeDown = function() {
      $scope.playerControls.changeVolume(-10);
    };
    $scope.volumeUp = function() {
      $scope.playerControls.changeVolume(10);
    };

    $scope.toggleMute = function () {
      var statusData = $scope.playerControls.getStatusData();
      if (statusData.volume > 0) {
        $scope.playerControls.setVolume(0);
      } else {
        $scope.playerControls.setVolume(50);
      }
    };

    $scope.setPlaybackRate = function(rate) {
      $scope.currentRate = rate;
      $scope.playerControls.setPlaybackRate($scope.currentRate);
    };

    $scope.seekTo = function(sec) {
      var statusData = $scope.playerControls.getStatusData();
      if (parseFloat(sec) > statusData.duration) {
        sec = statusData.duration;
      }
      $scope.playerControls.seekTo(sec);
    };

    /**
     * @todo refactor to a service
     */
    var getKeyByValue = function(object, value ) {
      for( var prop in object ) {
        if( object.hasOwnProperty( prop ) ) {
          if( object[prop] === value ) {
            return prop;
          }
        }
      }
    };

    $scope.videoQualities = {
      'default': 'auto',
      'highres': '>1080p',
      'hd1080' : '1080p',
      'hd720'  : '720p',
      'large'  : '480p',
      'medium' : '380p',
      'small'  : '240p'
    };
    $scope.selectQuality = function(quality) {
      $scope.loadVideo.quality = getKeyByValue($scope.videoQualities, quality);
      var statusData = $scope.playerControls.getStatusData();
      //$scope.loadVideo.id = statusData.videoData['video_id'];
      //$scope.playerControls.loadVideoById($scope.loadVideo);
      $scope.playerControls.setPlaybackQuality($scope.loadVideo.quality);
    };
    var volumeStatus = $scope.volumeStatus;

    var satusListener = function(statusData) {
      $scope.volumeStatus.volume = statusData.volume;
     if ($scope.volumeStatus.volume <= 0) {
        $scope.volumeStatus.muteLabel = 'Unmute';
      } else {
        $scope.volumeStatus.muteLabel = 'Mute';
      }
      $scope.volumeStatus.label = $scope.volumeStatus.volume;
      $scope.playbackRates      = $scope.playerControls.getAvailablePlaybackRates() || $scope.playbackRates;
      $scope.duration = statusData.duration;

      $scope.$apply();
    }
    //watch for volume / mute
    $scope.playerControls.addListener(satusListener);

    $scope.parseScript = function(text) {
      $scope.parser.setScriptText(text);
      $scope.script.result = $scope.parser.parse(text);
    }
  }

  ]
);

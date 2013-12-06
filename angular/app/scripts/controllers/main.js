'use strict';
var callPlayer;

angular.module('angularApp').controller(
  'MainCtrl',
  ['$scope', 'Player', 'PlayerControls', function ($scope, Player, PlayerControls) {

    var playerElementId = 'player';

    $scope.pauseState = 'Pause';

    $scope.loadVideo = {
      'id': 'Zs6udGtMLS0',
      'quality': 'default'
    };

    $scope.playerFactory = Player;
    $scope.player = $scope.playerFactory().getPlayer(
      {
        'target': playerElementId,
        'events':{
          'onReady': function (event) {event.target.playVideo();}
        }
      }
    );

    $scope.playerControlFactory = PlayerControls;
    $scope.playerControls = $scope.playerControlFactory().getControls(callPlayer, playerElementId);
    $scope.playerControls.startListening();

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
      $scope.loadVideo.id = statusData.videoData['video_id'];
      $scope.playerControls.loadVideoById($scope.loadVideo);
    };
  }
  ]
);

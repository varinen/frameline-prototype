'use strict';
var callPlayer;

angular.module('angularApp').controller(
  'EditorCtrl',
  ['$scope',
    'Player',
    'PlayerControls',
    'commandsDictionary',
    'script',
    'ScriptParser',
    function ($scope, Player, PlayerControls, commandsDictionary, script, ScriptParser) {
      var playerElementId = 'player';

      $scope.loadVideo = {
        'id': 'JtbDDqU3dVI',
        'quality': 'default'
      };
      $scope.playerFactory = Player;
      $scope.player = $scope.playerFactory().getPlayer(
        {
          'target': playerElementId,
          'videoId': $scope.loadVideo.id,
          'events':{
            'onReady': function (event) {event.target.playVideo();}
          }
        }
      );
      $scope.playerControls = $scope.playerControlFactory().getControls(callPlayer, playerElementId);
      $scope.playerControls.startListening();

      script.startScript();
      $scope.playScript = function() {
        for (var i = 0; i < script.commandSequence.length; i += 1) {

        }
      };
    }
  ]
);
'use strict';
var callPlayer;

angular.module('angularApp').controller(
  'JokerCtrl',
  ['$scope',
    'Player',
    'PlayerControls',
    'script',
    function ($scope, Player, PlayerControls, script) {
      var playerElementId = 'player';

      $scope.heading = "Joker Best Scenes";
      $scope.script = {
        'result': '',
        'text':
          "offset 0 startScript {id:5K3E5tLoado, startSecond: 11.5, width:640, height: 480, quality: default};" + "\n" +
          "offset 4 seekTo {position: 18};" + "\n" +
          "offset 18 seekTo {position: 118.8};" + "\n" +
          "offset 21.5 seekTo {position: 153};" + "\n" +
          "offset 25 loadVideo {id:DgzssDOTMXs, startSecond: 41, quality: default};" + "\n" +
          "offset 29 loadVideo {id:jrIc1SlA7O8, startSecond: 35, quality: default};" + "\n" +
          "offset 34 stop;"
      };

      $scope.playerFactory = Player;
      $scope.player = $scope.playerFactory().getPlayer(
        {
          'target': playerElementId
        }
      );
      $scope.playerControlFactory = PlayerControls;
      $scope.playerControls = $scope.playerControlFactory().getControls(callPlayer, playerElementId);
      $scope.playerControls.startListening();

      $scope.playScript = function(text) {
        $scope.commandLog = [];
        $scope.errorLog = [];
        script.setScope($scope);
        var commands = script.parseText(text);
        $scope.script.result = JSON.stringify(commands);
        script.play(playerElementId);
      };
    }
  ]
);
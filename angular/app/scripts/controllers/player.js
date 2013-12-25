'use strict';
var callPlayer;

angular.module('angularApp').controller(
  'PlayerCtrl',
  ['$scope',
    'Player',
    'PlayerControls',
    'script',
    function ($scope, Player, PlayerControls, script) {
      var playerElementId = 'player';

      $scope.script = {'result': ''};

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
        var commands = script.parseText(text);
        $scope.commandLog = [];
        script.setScope($scope);
        $scope.script.result = JSON.stringify(commands);
        script.play(playerElementId);
      };
    }
  ]
);
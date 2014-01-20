'use strict';
var callPlayer;

angular.module('angularApp').controller(
  'QuotesCtrl',
  ['$scope',
    'Player',
    'PlayerControls',
    'script',
    function ($scope, Player, PlayerControls, script) {
      var playerElementId = 'player';

      $scope.heading = "Best Movie Quotes";
      $scope.script = {
        'result': '',
        'text':
          "offset 0 startScript {id:SeldwfOwuL8, startSecond: 12, width:640, height: 480, quality: default};" + "\n" +
          "offset 4.5 loadVideo {id:GQ5ICXMC4xY, startSecond: 10, quality: default};" + "\n" +
          "offset 9 loadVideo {id:kAmsi05P9Uw, startSecond: 80, quality: default};" + "\n" +
          "offset 12 loadVideo {id:ZSNyiSetZ8Y, startSecond: 31, quality: default};" + "\n" +
          "offset 16 loadVideo {id:220l5e0My-Q, startSecond: 72, quality: default};" + "\n" +
          "offset 20 loadVideo {id:iu92GxXf1X8, startSecond: 53, quality: default};" + "\n" +
          "offset 23 loadVideo {id:i2lmFCqbJcI, startSecond: 0, quality: default};" + "\n" +
          "offset 29 loadVideo {id:3ishbTwXf1g, startSecond: 137, quality: default};" + "\n" +
          "offset 39 seekTo {position:200};" + "\n" +
          "offset 44 stop;"
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
'use strict';
var callPlayer;

angular.module('angularApp').controller(
  'StarwarsCtrl',
  ['$scope',
    'Player',
    'PlayerControls',
    'script',
    function ($scope, Player, PlayerControls, script) {
      var playerElementId = 'player';

      $scope.heading = "Star Wars IV New Hope in 2 mins";
      $scope.script = {
        'result': '',
        'text':
            "offset 0 startScript {id:367FSjWvNB4, startSecond: 0, width:640, height: 480, quality: highres};" + "\n" +
            "offset 0.5 seekTo {position: 25};" + "\n" +
            "offset 7 seekTo {position: 90};" + "\n" +
            "offset 10 loadVideo {id:MftSEu4vgg0, startSecond:17, quality: default};" + "\n" +
            "offset 14 setVolume {volume:10};" + "\n" +
            "offset 15 loadVideo {id:ts6Y-3FVhSc, startSecond:0, quality: highres};" + "\n" +
            "offset 15.5 seekTo {position: 30};" + "\n" +
            "offset 21 loadVideo {id:DIzAaY2Jm-s, startSecond:0, quality: default};" + "\n" +
            "offset 21.5 seekTo {position: 6};" + "\n" +
            "offset 22 setVolume {volume:50};" + "\n" +
            "offset 26 seekTo {position:38};" + "\n" +
            "offset 34 seekTo {position:202};" + "\n" +
            "offset 47 loadVideo {id:qBAZGtBfcY4, startSecond:5, quality: default};" + "\n" +
            "offset 54 seekTo {position: 78};" + "\n" +
            "offset 57 loadVideo {id:bosSsgzgenA, startSecond:0, quality: default};" + "\n" +
            "offset 69 loadVideo {id:jsNv6c6chBA, startSecond:12, quality: default};" + "\n" +
            "offset 72.5 loadVideo {id:PlMWYYzVngM, startSecond:107, quality: default};" + "\n" +
            "offset 78 loadVideo {id:7U3Oti2L8S4, startSecond:62, quality: default};" + "\n" +
            "offset 82 seekTo {position:360};" + "\n" +
            "offset 90 loadVideo {id:220l5e0My-Q, startSecond:72, quality: default};" + "\n" +
            "offset 103 seekTo {position: 157};" + "\n" +
            "offset 107 seekTo {position:170};"
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
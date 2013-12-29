'use strict';
var callPlayer;

angular.module('angularApp').controller(
  'EditorCtrl',
  [
    '$scope',
    '$compile',
    'Player',
    'PlayerControls',
    'commandsDictionary',
    'script',
    'ScriptList',
    function ($scope, $compile, Player, PlayerControls, commandsDictionary, script, ScriptList) {

      var commandNames = Object.keys(commandsDictionary.commands),
        playerElementId = 'player',i;

      //generate a list of the stored scripts
      $scope.storedScripts = ScriptList.query({action:'list_scripts'});

      //generate and display the command menu
      $scope.commandsMenu = [];
      commandNames.sort();
      var indexOfStartScript = commandNames.indexOf('startScript');
      if (indexOfStartScript > -1) {
        commandNames.splice(indexOfStartScript, 1);
        commandNames.unshift('startScript');
      }
      for (i = 0; i < commandNames.length; i += 1) {
        $scope.commandsMenu.push({'name' :commandNames[i]});
      }


      $scope.addCommand = function(commandName) {
        alert(commandName);
      }



      $scope.editScript = function(fileName) {
        var i, scriptJson = ScriptList.query(
          {action:'get_script', filename:fileName},
          function () {
            $scope.commandLog = [];
            $scope.errorLog = [];
            $scope.commandList = [];

            for (i = 0; i < scriptJson.length; i += 1) {
              if (scriptJson[i].hasOwnProperty('command') && scriptJson[i].hasOwnProperty('offset')) {
                try {
                  var offset = scriptJson[i].offset;
                  var command = commandsDictionary.validateCommand(scriptJson[i].command);
                  $scope.commandList[i] = {'offset': offset, 'command': command};
                } catch (e) {
                  $scope.errorLog.push('Can\'t parse command: ' + JSON.stringify(scriptJson[i].command));
                  return false;
                }
              }
            }
            //an independent reference to the original command list keys is needed
            var commandKeys = Object.keys($scope.commandList);
            for (i = 0; i < commandKeys.length; i += 1) {
              var commandName = Object.keys($scope.commandList[commandKeys[i]].command).shift();
              $scope['commandObject_' + commandKeys[i]] = $scope.commandList[commandKeys[i]];
              var commandElement =
                angular.element(document.createElement(commandName.toLowerCase()))
                  .attr('commandobject', 'commandObject_' + commandKeys[i]);
              var el = $compile( commandElement)( $scope, function (e1, $scope) { angular.element('div#editor').append(e1)} );
              var e = 0;
              //angular.element('div#editor').append(commandElement);
            }

          },
          function() {
            $scope.errorLog = [];
            $scope.errorLog.push('Cant\'t read script');
          }
        );
      }
    }
  ]
);
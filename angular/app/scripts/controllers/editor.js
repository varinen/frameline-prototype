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
        playerElementId = 'player', i;

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

      $scope.setDropDownValue = function(valueToSet, propertyName, commandObject) {
        var value, commandName = Object.keys(commandObject.command).shift();
        switch (propertyName) {
          case 'quality': value = getKeyByValue(commandsDictionary.qualities, valueToSet);
            break;
          case 'dimension': value = getKeyByValue(commandsDictionary.dimensions, valueToSet);
        }
        commandObject.command[commandName].args[propertyName] = value
        //$scope.$apply();
        var b = 1;
      }

      //generate a list of the stored scripts
      $scope.storedScripts = ScriptList.query({action:'list_scripts'});
      $scope.commandsDictionary = commandsDictionary;

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
        angular.element('div#editor').html('');
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

              //not the brightest idea, but, for every command in the list a property is created for the
              //scope using the command's name and its id (position) in the command list.
              //This way it is possible to pass the property name in the attribute to the directive
              //that will represent it. The assignment is dynamic and the changes made in the directive's
              //inputs will change the command's properties in the scope.
              $scope['commandObject_' + commandKeys[i]] = $scope.commandList[commandKeys[i]];
              $scope['commandObject_' + commandKeys[i]].commandKey = commandKeys[i];
              var commandElement =
                angular.element(document.createElement(commandName.toLowerCase()))
                  .attr('commandobject', 'commandObject_' + commandKeys[i])
                  .attr('commandsdictionary', 'commandsDictionary')
                  .attr('setdropdownvalue', 'setDropDownValue');
              //the created directive's element is compiled into a dom object and appended to the editor
              var el = $compile( commandElement)(
                $scope,
                function (e1, $scope) { angular.element('div#editor').append(e1)}
              );

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
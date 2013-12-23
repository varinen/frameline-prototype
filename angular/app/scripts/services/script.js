'use strict';
var callPlayer;

var scriptService = angular.module('scriptService', ['commandsDictionaryService', 'scriptParserService']);

scriptService.service('script', [
  'PlayerControls',
  'commandsDictionary',
  'ScriptParser',
  function(PlayerControls, commandsDictionary, ScriptParser) {
    var commands = [],
      parserFactory = ScriptParser,
      parser = parserFactory(),
      errorMessage,
      controlsFactory = PlayerControls,
      controls,
      currentPosition,
      offset,
      time;

    return {
      /**
       * Parses text script into commands array
       *
       * @param text text to parse, example:
       *
       * offset 0 startScript {id:JtbDDqU3dVI, startSecond: 0, width:640, height: 480, quality: default};
       * offset 10 setVolume {volume:100};
       * offset 20 setAnchor;
       * offset 10 setVolume {volume:0};
       * offset 20 setVolume {volume:10};
       * offset 30.5 seekTo {position:10.5};
       * offset 49 loadVideo {id:sdv_TbmA3CM, quality: default};
       * offset 10 seekTo {position:90};
       * offset 120 stop;
       *
       * @returns {*}
       */
      parseText: function (text) {
        try {
          commands = parser.parseText(text);
          return commands;
        } catch (e) {
          errorMessage = 'Can\'t parse text script.';
          console.log(errorMessage);
        }
        return false;
      },

      /**
       * Parses a JSON string into a commands array
       *
       * @param json a JSON string, example:
       *
       * [{"offset":"0","command":{"startScript":{"args":{"id":"JtbDDqU3dVI","startSecond":"0","width":"640","height":"480","quality":"default","dimension":"640x390"}}}}]
       *
       * @returns {*}
       */
      parseJson: function (json) {
        try {
          commands = parser.parseJson(json);
          return commands;
        } catch (e) {
          errorMessage = 'Can\'t parse JSON script.';
          console.log(errorMessage);
        }
        return false;
      },
      /**
       * Returns the commands array
       *
       * @returns {Array}
       */
      getCommands: function () {
        return commands;
      },

      play: function (playerElementId) {
        time = new Date().getTime();
        var k;
        currentPosition = 0;
        offset          = 1;
        controls = controlsFactory().getControls(callPlayer, playerElementId);
        var callback = this.executeCommand;
        for (k = 0; k < commands.length; k += 1) {
          /**
           * @see http://stackoverflow.com/questions/6425062/passing-functions-to-settimeout-in-a-loop-always-the-last-value
           */
          setTimeout(
            (function(commandData) {
              return function() {callback(commandData);};
            })(commands[k].command),
            (offset + parseFloat(commands[k].offset)) * 1000
          );
          currentPosition += (parseFloat(commands[k].offset) + offset);
        }
      },

      executeCommand: function(command) {
        var now = new Date().getTime();
        var commandName = Object.keys(command).shift();
        console.log((now - time) + ' '+ commandName + ' ' + JSON.stringify(command[commandName].args));
        //return;
        if (commandName === 'setAnchor') {
          offset = currentPosition;
        } else {
          controls[commandName](command[commandName].args);
        }
      }
    };
  }
]
);
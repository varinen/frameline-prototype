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
      time,
      playingCommands,
      isPlaying,
      statusData,
      script = this;

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

      /**
       * Plays the script commands sequence into a player located under the playerElementId element
       * 
       * @param playerElementId
       */
      play: function (playerElementId) {
        var k, errorMessage, now, statusData;
        
        //set starting time
        time      = new Date().getTime();
        //it's not playing yet
        isPlaying = false;
        controls  = controlsFactory().getControls(callPlayer, playerElementId);

        //clone the commands array
        playingCommands = commands.slice(0);
        //start script - must be the first command in the sequence
        var startScript = playingCommands.shift();
        if ('startScript' !== Object.keys(startScript.command).shift()) {
          errorMessage = 'Expected a "startScript" command in the beginning, instead, '
            + Object.keys(startScript.command).shift() + ' is detected';
          console.log(errorMessage);
          throw (errorMessage);
        }

        //put a script reference into the closure var script
        script = this;
        
        //load video using the startScript command
        controls.startScript(startScript.command.startScript.args);
        
        //start lisening for player messages to schedule the first command when the video is loaded
        callPlayer(playerElementId, 'listening');
        window.addEventListener(
          'message',
          this.startScheduling,
          true
        );
      },

      /**
       * Check if the video is started loading and schedulte the first command
       * 
       * @param e event to listen to
       */
      startScheduling: function(e) {
        var i, property, data = JSON.parse(e.data);
        if (
          ((e.origin === 'http://www.youtube.com') || (e.origin === 'https://www.youtube.com')) &&
            (data.event === 'infoDelivery')) {
          //update the private script var statusData 
          statusData = data.info;
          // start scheduling if the script is not playing but the video has started loading
          if (!isPlaying && data.info && data.info.videoBytesLoaded && data.info.videoBytesLoaded > 0) {
            isPlaying = true;
            script.scheduleCommand(data.info);
          }
        }
      },
      /**
       * Schedule a command
       *
       * @param statusData player status data
       */
      scheduleCommand: function (statusData) {
        var command = playingCommands.shift();
        if (!command || !command.offset || !command.command) {
          return;
        }
        var callback = this.executeCommand,
          schedule   = parseFloat(command.offset),
          now        = new Date().getTime();

        console.log((now - time) / 1000 + ': scheduling '+ Object.keys(command.command).shift() + ' ' +
         'schedule: ' + schedule +
          ', current: ' + statusData.currentTime + ', offset: ' + command.offset);
        /**
         * @see http://stackoverflow.com/questions/6425062/passing-functions-to-settimeout-in-a-loop-always-the-last-value
         */
          setTimeout(
            (function(commandData) {
              return function() {callback(commandData);};
            })(command.command),
            (schedule) * 1000
          );

      },

      /**
       * Executes a command and schedules the next one in the sequence
       *
       * @param command
       */
      executeCommand: function(command) {
        var now = new Date().getTime(),
          commandName = Object.keys(command).shift();
        console.log('executing ' + ((now - time) / 1000) + ' '+ commandName + ' ' + JSON.stringify(command[commandName].args));

        if (commandName === 'setAnchor') {
          offset = currentPosition;
        } else {
          controls[commandName](command[commandName].args);
        }
        script.scheduleCommand(statusData);
      }
    };
  }
]
);
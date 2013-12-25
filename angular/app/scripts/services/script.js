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
      anchor = 0,
      time,
      playingCommands,
      isPlaying,
      statusData,
      scope,
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
          this.log(errorMessage + ': ' + e.message, true);
          throw new Error(errorMessage);
        }
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
          this.log(errorMessage + ': ' + e.message, true);
          throw new Error(errorMessage);
        }
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
        var errorMessage;

        //commandLog = [];
        //set starting time
        time      = new Date().getTime();
        //it's not playing yet
        isPlaying = false;
        controls  = controlsFactory().getControls(callPlayer, playerElementId);

        //clone the commands array
        playingCommands = commands.slice(0);
        //start script - must be the first command in the sequence
        var startScript = playingCommands.shift();
        if (!startScript ) {
          errorMessage = 'Can\'t recognize the first command in the sequence';
          this.log(errorMessage, true);
          throw new Error(errorMessage);
        }
        if ('startScript' !== Object.keys(startScript.command).shift()) {
          errorMessage = 'Expected a "startScript" command in the beginning, instead, ' +
            Object.keys(startScript.command).shift() + ' is detected';
          this.log(errorMessage, true);
          throw new Error(errorMessage);
        }

        //put a script reference into the closure var script
        script = this;

        //clear the message and the error log
        this.resetLog(false);
        this.resetLog(true);

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
        var data = JSON.parse(e.data);
        if (
          ((e.origin === 'http://www.youtube.com') || (e.origin === 'https://www.youtube.com')) &&
            (data.event === 'infoDelivery')) {
          //update the private script var statusData 
          statusData = data.info;
          // start scheduling if the script is not playing but the video has started loading
          if (!isPlaying && data.info && data.info.videoBytesLoaded && data.info.videoBytesLoaded > 0) {
            isPlaying = true;
            //set anchor to now - from this position the offset time is calculated
            anchor = new Date().getTime();
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
        var schedule, callback = this.executeCommand,
          now = new Date().getTime();

        schedule = anchor / 1000 + parseFloat(command.offset)- now / 1000;

        if (schedule < 0) {
          schedule = 0;
        }
        script.log(
          'At ' + (now - time) / 1000 + ': scheduling '+ Object.keys(command.command).shift() + ' ' +
         'schedule: ' + schedule + ', current: ' + statusData.currentTime + ', offset: ' + command.offset,
          false
        );
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
       * Execute a command and schedule the next one in the sequence
       *
       * @param command
       */
      executeCommand: function(command) {
        var now = new Date().getTime(),
          commandName = Object.keys(command).shift();
        script.log(
          'At ' + ((now - time) / 1000) + ': executing ' +
          commandName + ' ' + JSON.stringify(command[commandName].args),
          false
        );

        if (commandName === 'setAnchor') {
          anchor = new Date().getTime();
          script.log('Setting anchor to ' + anchor / 1000, false);
        } else {
          controls[commandName](command[commandName].args);
        }
        script.scheduleCommand(statusData);
      },

      /**
       * Logs messages
       *
       * @param message
       * @param error error log flag
       */
      log: function (message, error) {
        if (scope && scope.$apply) {
          if (error && scope.errorLog) {
            scope.errorLog.push(message);
          } else if (scope.commandLog) {
            scope.commandLog.push(message);
          }
          try {
            scope.$apply();
          } catch (e) {
            console.log(e.message);
          }

        }
        console.log(message);
      },

      /**
       * Clears the log
       *
       * @param error flag to clear the error log
       */
      resetLog: function (error) {
        if (scope && scope.$apply) {
          if (error && scope.errorLog) {
            scope.errorLog.length = 0;
          } else if (scope.commandLog) {
            scope.commandLog.length = 0;
          }
          try {
            scope.$apply();
          } catch (e) {
            console.log(e.message);
          }

        }
      },

      /**
       * Sets the external scope to script
       *
       * @param externalScope
       */
      setScope: function (externalScope) {
        scope = externalScope;
      }
    };
  }
]
);
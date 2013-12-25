'use strict';

var scriptParserService = angular.module('scriptParserService', ['commandsDictionaryService']);

scriptParserService.factory('ScriptParser',
  [
    'commandsDictionary',
    function(commandsDictionary) {
      var scriptText,
        scriptJson,
        scriptResult,
        //regex to check command names
        commReg = /^(?:\s+([0-9.]+)\s+)(?:([A-Za-z]+))(?:\s+\{([\w,\s\.:]+)\})?;\s*$/,
        //regex to check argument names
        argReg = /(?:\s*(\w+):\s*(\w+)\s*)/,
        commands = [];
      return function() {
        return {
          setScriptJson: function (json) {
            scriptJson = json;
          },
          getScriptJson: function () {
            return scriptJson;
          },
          /**
           * Sets the private property scriptText
           *
           * @param text
           */
          setScriptText: function (text) {
            scriptText = text;
          },
          /**
           * Returns the private property scriptText
           *
           * @returns {*}
           */
          getScriptText: function () {
            return scriptText;
          },
          /**
           * Parses a text into a command object
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
           * @returns {Array}
           */
          parseText: function (text) {
            var command,
              offset,
              commandName,
              args,
              result = [];

            //reset commands
            commands = [];

            //if the the argument text is not defined, use private property scriptText
            scriptText = text || this.getScriptText();
            this.setScriptText(scriptText);

            //every command in a sequence begins with keyword 'offset' - here also used as a separator
            scriptResult = scriptText.split('offset');

            for (var i = 0; i < scriptResult.length; i += 1) {
              if (scriptResult[i].length === 0) {
                continue;
              }
              args        = {};
              commandName = undefined;
              command     = {};
              offset      = 0;

              //recognize the command secquence
              result = commReg.exec(scriptResult[i]);
              if (!result) {
                throw new Error('Unrecognizable command line: ' + scriptResult[i]);
              }
              //result[1] = value of offset
              //result[2] = command name
              //result[3] = arguments list

              offset      = result[1];
              commandName = result[2];
              if (commands.length === 0 && commandName !== 'startScript') {
                var startMissing = 'The first command in the script must be "startScript", instead, ' + commandName + ' was detected';
                console.log(startMissing);
                throw new Error(startMissing);
              }
              if (result[3]) {
                try {
                  //parse arguments
                    args = this.parseArgs(result[3]);
                  } catch (e) {
                  throw new Error('Error in script command line ' + scriptResult[i] + ': ' + e.message);
                }
              }
              command[commandName] = {'args': args};
              try {
                command = commandsDictionary.validateCommand(command);
                commands.push({'offset': offset, 'command': command});
              } catch (e) {
                throw new Error('Error in script command line ' + scriptResult[i] + ': ' + e.message);
              }
            }
            return commands;
          },
          /**
           * Parses a string with command arguments, example:
           *
           * id:JtbDDqU3dVI, startSecond: 0, width:640, height: 480, quality: default
           *
           * @param args
           * @returns {{}}
           */
          parseArgs: function (args) {
            var i, arg, argMatches, results = {};
            args = args.split(',');

            for (i = 0; i < args.length; i += 1) {
              arg = {};
              argMatches = argReg.exec(args[i]);
              if (argMatches && argMatches[1] && argMatches[2]) {
                results[argMatches[1]] = argMatches[2];
              } else {
                throw new Error('Invalid argument: ' + args[i]);
              }
            }
            return results;
          },
          /**
           * Parses a JSON object and validates its command data
           *
           * @param json a json object
           *
           * @returns {Array}
           */
          parseJson: function (json) {
            var i, j, command = {}, commands = [], commandName;
            json = JSON.parse(json);
            this.setScriptJson(json);
            for (i = 0; i < json.length; i += 1) {
              //every command must have an offset in seconds
              if (this.isNumber(json[i].offset) !== true) {
                j = 1 + i;
                throw new Error('Undefined offset in command number ' + j);
              }
              command     = commandsDictionary.validateCommand(json[i].command);
              commandName = Object.keys(json[i].command).shift();
              //the first command must be startScript
              if (commands.length === 0 && commandName !== 'startScript') {
                var startMissing =
                  'The first command in the script must be "startScript", instead, ' + commandName + ' was detected';
                throw new Error(startMissing);
              }
              commands.push({'offset': json[i].offset, 'command': command});
            }
            return commands;
          },

          /**
           * Checks if the parameter is a number
           *
           * @param n value to check
           *
           * @returns {boolean|*|HTMLElement}
           */
          isNumber: function (n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
          }
        };
      };
    }
  ]
);
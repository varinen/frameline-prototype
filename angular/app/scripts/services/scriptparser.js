'use strict';

var scriptParserService = angular.module('scriptParserService', []);

scriptParserService.factory('ScriptParser',
  function() {
    var scriptText,
      scriptResult,
      commReg = /^(?:\s+([0-9.]+)\s+)(?:([A-Za-z]+))(?:\s+\{([\w,\s\.:]+)\})?;\s*$/,
      argReg = /^(\w+:\s*\w+,*\s*)*$/;
    var commands = [];
    return function() {
      return {
        setScriptText: function (text) {
          scriptText = text;
        },
        getScriptText: function () {
          return scriptText;
        },
        parse: function () {
          var command, result = [];
          var params = ['offset', 'command', 'args'];

          //reset commands
          commands = [];
          scriptResult = scriptText.split('offset');
          for (var i = 0; i < scriptResult.length; i += 1) {
            if (scriptResult[i].length === 0) {
              continue;
            }
            result = commReg.exec(scriptResult[i]);
            command = {};
            for (var j = 1; j < result.length; j += 1) {
              if (j === 3) {
                try {
                  var args = this.parseArgs(result[j]);
                  command[params[j-1]] = args;
                } catch (e) {
                  console.log(e + ': command line ' + scriptResult[i]);
                }

              } else {
                command[params[j-1]] = result[j];
              }
            }
            commands.push(command);
          }
          return scriptText;
        },
        parseArgs: function(args) {
          var i, matches = argReg.exec(args), results = [];
          if (!matches) {
            throw 'Argument not recognized';
          }
          for (i = 1; i < matches.length; i += 1) {
            var arg = {};
            var match = matches[i].split(':');
            if (match.length !== 2) {
              throw 'Invalid argument: ' + matches[i];
            }
            arg[match[0]] = match[1];
            results.push(arg);
          }
          return results;
        }
      }
    }
  });
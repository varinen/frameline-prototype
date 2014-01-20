'use strict';

var commandsDictionaryService = angular.module('commandsDictionaryService', []);

commandsDictionaryService.service('commandsDictionary',
  function() {
    var dimensionRegex = /(640x390|560x315)/, //one of the available dimensions
      idRegex      = /(\w+)/, //any alphanumeric and underline
    // digitRegex   = /(\d+)/, //any digit
      qualityRegex = /(default|highres|hd1080|hd720|large|medium|small)/, //any of the qualities
      volumeRegex  = /(\d{1,2})/, //any 1 or 2 digit int number
      floatRegex   = /(\d+\.?\d*)/; //any float number
    return {
      qualities: {
        'default': 'auto',
        'highres': '>1080p',
        'hd1080' : '1080p',
        'hd720'  : '720p',
        'large'  : '480p',
        'medium' : '380p',
        'small'  : '240p'
      },
      dimensions: {
        '640x390': '640x390',
        '560x315': '560x315'
      },
      /**
       * A collection of available commands and their arguments
       */
      commands: {
        'startScript': {
          'args': {
            'id': {'required': true, 'regex': idRegex, 'default': ''},
            'startSecond': {'required': false, 'regex': floatRegex},
            'dimension': {'required': true, 'regex': dimensionRegex, 'default': '640x390'},
            'quality': {'required': true, 'regex': qualityRegex, 'default': 'default'}
          }
        },
        'setVolume': {
          'args': {
            'volume': {'required': true, 'regex': volumeRegex, 'default': 0}
          }
        },
        'seekTo': {
          'args': {
            'position': {'required': true, 'regex': floatRegex, 'default': 0}
          }
        },
        'setAnchor': {
          'args': {}
        },
        'pause': {
          'args': {
            'duration': {'required': false, 'regex': floatRegex}
          }
        },
        'play': {
          'args': {}
        },
        'stop': {
          'args': {}
        },
        'loadVideo': {
          'args': {
            'id':  {'required': true, 'regex': idRegex, 'default': ''},
            'startSecond': {'required': false, 'regex': floatRegex},
            'quality': {'required': true, 'regex': qualityRegex, 'default': 'default'}
          }
        }
      },

      /**
       * Validates a command object by checking it against the settings in the command dictionary and
       * if necessary augmenting missing required properties with defaults if applicable.
       *
       * @param command command object {commandName: {args: { argName: {properyName: value} ...}}}
       *
       * @returns {*}
       */
      validateCommand: function(command) {
        var i, arg,
          commandArgs       = {},
          argsCheck         = {},
          result            = false,
          commandName       = Object.keys(command).shift(), //first (and only) key in the command object
          availableCommands = Object.keys(this.commands); //names of all commands in the dictionary
        //check if the command name is in the available commands list
        for (i = 0; i < availableCommands.length; i += 1) {
          if (commandName === availableCommands[i]) {
            result = true;
            break;
          }
        }
        if (result === false) {
          throw new Error('Command is not available: ' + commandName);
        }
        //arguments of the validated command
        commandArgs = Object.keys(command[commandName].args);
        //arguments of the command as defined in the dictionary
        argsCheck   = Object.keys(this.commands[commandName].args);

        //validate args
        for (i = 0; i < argsCheck.length; i += 1) {
          arg = this.commands[commandName].args[argsCheck[i]];
          //argument not found, add it with the default value
          if (!command[commandName].args[argsCheck[i]]) {
            if (arg.required) {
              command[commandName].args[argsCheck[i]] = arg.default;
            }
          } else {
            //check the value
            if (!arg.regex.test(command[commandName].args[argsCheck[i]])) {
              throw new Error(
                'The argument value is incorrect. Command: ' + commandName +
                ', argument:  ' + argsCheck[i] + ', value: ' + command[commandName].args[argsCheck[i]] +
                ', regex: ' + arg.regex
              );
            }
          }
        }
        return command;
      }
    };
  }
);
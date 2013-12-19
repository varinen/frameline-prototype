'use strict';

function Script(commandsDictionary) {
  this.commandsDictionary = commandsDictionary;
  this.commandSequence = [];

  this.startScript = function() {
    this.commandSequence.push(
      {
        'startScript': {
          'args': {
            'id': '',
            'startSecond': 0,
            'dimension': '640x390', //@todo refactor into config value
            'quality': 'default' //@todo refactor into config value
          }
        }
      }
    );
  };
}

var scriptService = angular.module('scriptService', ['commandsDictionaryService']);

scriptService.factory('script', ['commandsDictionary',
  function(commandsDictionary) {
    return new Script(commandsDictionary);
  }
]
);
/**
 * @author       Rob W <gwnRob@gmail.com>
 * @website      http://stackoverflow.com/a/7513356/938089
 * @version      20131010
 * @description  Executes function on a framed YouTube video (see website link)
 *               For a full list of possible functions, see:
 *               https://developers.google.com/youtube/js_api_reference
 * @param String frameId The id of (the div containing) the frame
 * @param String func     Desired function to call, eg. "playVideo"
 *        (Function)      Function to call when the player is ready.
 * @param Array  args     (optional) List of arguments to pass to function func*/
var jQuery;
function callPlayer(frameId, func, args) {
  'use strict';
  if (window.jQuery && frameId instanceof jQuery) {
    frameId = frameId.get(0).id;
  }
  var iframe = document.getElementById(frameId);
  if (iframe && iframe.tagName.toUpperCase() !== 'IFRAME') {
    iframe = iframe.getElementsByTagName('iframe')[0];
  }

  // When the player is not ready yet, add the event to a queue
  // Each frameId is associated with an own queue.
  // Each queue has three possible states:
  //  undefined = uninitialised / array = queue / 0 = ready
  if (!callPlayer.queue) {
    callPlayer.queue = {};
  }
  var queue = callPlayer.queue[frameId],
    domReady = document.readyState === 'complete';

  if (domReady && !iframe) {
    // DOM is ready and iframe does not exist. Log a message
    if (window.console) {
      console.log('callPlayer: Frame not found; id=' + frameId);
    }
    if (queue) {
      clearInterval(queue.poller);
    }
  } else if (func === 'listening') {
    // Sending the "listener" message to the frame, to request status updates
    if (iframe && iframe.contentWindow) {
      func = '{"event":"listening","id":' + JSON.stringify(''+frameId) + '}';
      iframe.contentWindow.postMessage(func, '*');
    }
  } else if (!domReady ||
    iframe && (!iframe.contentWindow || queue && !queue.ready) ||
    (!queue || !queue.ready) && typeof func === 'function') {
    if (!queue) {
      queue = callPlayer.queue[frameId] = [];
    }
    queue.push([func, args]);
    if (!('poller' in queue)) {
      // keep polling until the document and frame is ready
      queue.poller = setInterval(function() {
        callPlayer(frameId, 'listening');
      }, 250);
      // Add a global "message" event listener, to catch status updates:
      messageEvent(1, function runOnceReady(e) {
        if (!iframe) {
          iframe = document.getElementById(frameId);
          if (!iframe) {
            return;
          }
          if (iframe.tagName.toUpperCase() !== 'IFRAME') {
            iframe = iframe.getElementsByTagName('iframe')[0];
            if (!iframe) {
              return;
            }
          }
        }
        if (e.source === iframe.contentWindow) {
          // Assume that the player is ready if we receive a
          // message from the iframe
          clearInterval(queue.poller);
          queue.ready = true;
          messageEvent(0, runOnceReady);
          // .. and release the queue:
          var tmp;
          while (tmp = queue.shift()) {
            callPlayer(frameId, tmp[0], tmp[1]);
          }
        }
      }, false);
    }
  } else if (iframe && iframe.contentWindow) {
    // When a function is supplied, just call it (like "onYouTubePlayerReady")
    if (func.call) {
      return func();
    }
    // Frame exists, send message
    iframe.contentWindow.postMessage(JSON.stringify({
      'event': 'command',
      'func' : func,
      'args' : args || [],
      'id'   : frameId
    }), '*');
  }
  /* IE8 does not support addEventListener... */
  function messageEvent(add, listener) {
    var w3 = add ? window.addEventListener : window.removeEventListener;
    w3 ?
      w3('message', listener, !1)
      :
      (add ? window.attachEvent : window.detachEvent)('onmessage', listener);
  }
}
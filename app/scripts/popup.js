'use strict';

// listen for messages sent by getPagesSource.js
chrome.runtime.onMessage.addListener(function(request, sender) {
  if (request.action == "getSource") {
    message.innerText = request.source; // replace the popup text with page text
  }
});

function onWindowLoad() {

  var message = document.querySelector('#message');

  chrome.tabs.executeScript(null, { file: "scripts/mark.min.js" }, function() {
      chrome.tabs.executeScript(null, {
        file: "scripts/getPagesSource.js"
      }, function() {
        // error catching
        if (chrome.runtime.lastError) {
          message.innerText = 'There was an error injecting script : \n' + chrome.runtime.lastError.message;
        }
      });
    });
}

// define an onload function: when the page is loaded,
// run the function above to grab the text
window.onload = onWindowLoad;
'use strict';

// listen for messages sent by getPagesSource.js
chrome.runtime.onMessage.addListener(function(request, sender) {
  if (request.action == "getSource") {
    message.innerText = request.source; // replace the popup text with page text
  }
});

function onWindowLoad() {

  var message = document.querySelector('#message');

  chrome.tabs.executeScript(null, {
    file: "scripts/getPagesSource.js"
  }, function() {
    // error catching
    if (chrome.runtime.lastError) {
      message.innerText = 'There was an error injecting script : \n' + chrome.runtime.lastError.message;
    }
  });
}

// define an onload function: when the page is loaded,
// run the function above to grab the text
window.onload = onWindowLoad;


// LEGACY CODE FROM PREVIOUS EXTENSION!
// function setDOMInfo(info) {
//   var newH1 = document.createElement('h1');
//   newH1.innerHTML = info.title;
//   document.getElementById('title').appendChild(newH1);

//   info.sentences.forEach(function(sentence, idx) {
//     var newLi = document.createElement('li');
//     newLi.id = `sentence-${idx}`;
//     newLi.innerHTML = sentence;
//     document.getElementById('sentence-list').appendChild(newLi);
//   });
// }

// window.addEventListener('DOMContentLoaded', function () {
//   chrome.tabs.query({
//     active: true,
//     currentWindow: true
//   }, function (tabs) {
//     chrome.tabs.sendMessage(
//         tabs[0].id,
//         {from: 'popup', subject: 'DOMInfo'},
//         setDOMInfo);
//   });
// });

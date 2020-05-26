'use strict';

// helper function to add text to correct subdivision
function displayText(category, textList){
  console.log(category);
  for(var i = 0; i < textList.length; i++){
    var node = document.createElement("li");             // Create a <li> node
    var textnode = document.createTextNode(textList[i]); // Fill in the text
    node.appendChild(textnode);                          // Append the text to <li>
    document.getElementById(category).appendChild(node); 
  }
}

// listen for messages sent by getPagesSource.js
chrome.runtime.onMessage.addListener(function(request, sender) {
  if (request.action == "getSource") {
    
    if(request.source === null){
      message.innerText = "This isn't a Terms of Service page!";
    }

    var results = JSON.parse(request.source);
    for(var category in results){
      displayText(category, results[category]);
    }

    message.innerText = "That all we could find!";
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
          message.innerText = 'There was an error scanning the page : \n' + chrome.runtime.lastError.message;
        }
      });
    });
}

// define an onload function: when the page is loaded,
// run the function above to grab the text
window.onload = onWindowLoad;
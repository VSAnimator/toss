'use strict';

// helper function to add text to correct subdivision
function displayText(category, textList){
  console.log(category);
  for(var i = 0; i < textList.length; i++){
    var node = document.createElement("li");             // Create a <li> node
    var textnode = document.createTextNode(textList[i]); // Fill in the text
    node.appendChild(textnode);                          // Append the text to <li>
    document.getElementById("list " + category).appendChild(node); 
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

var filterKeys = [
    "govt", // Disclose info to the government: https://regex101.com/r/jpBIp1/2/tests
    "track", // Track you on other websites "DNT" header (Do Not Track), "track" https://regex101.com/r/c2DOeX/2
    "share", // Shares data with 3rd parties "share...information" "share...data" https://regex101.com/r/OQG4fv/2
    "sell", // Right to sell data in financial transactions https://regex101.com/r/fzEr74/2
    "copyright", // Owns copyright on your content https://regex101.com/r/STXxpi/1
    "court" // Waive right to go to court https://regex101.com/r/UY04SZ/2
]

// BUTTON SYNTAX:
document.addEventListener('DOMContentLoaded', function () {
    // settings button
    var settingsButton = document.getElementById("setting button");
    settingsButton.addEventListener('click', goToSettings);

    // close button
    var closeButton = document.getElementById("close button");
    closeButton.addEventListener('click', closeApp);

    // TODO: category buttons
});

function goToSettings() {
  window.location.href="options.html";
}

function closeApp() {
  window.close();
}

function goToHighlighted(id) {
  console.log(id);
}

// define an onload function: when the page is loaded,
// run the function above to grab the text
window.onload = onWindowLoad;
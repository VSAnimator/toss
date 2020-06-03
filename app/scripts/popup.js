'use strict';

// global variable to store search results
var searchResults = null;
var buttonStyle = "font-size:24px;color:#B9B9B9;"

// helper function to add text to correct subdivision
function displayText(category, resultDict){
  var numChildren = document.getElementById("list " + category).childNodes.length;
  // Okay so as long as we don't mess with the html format numChildren will be 1 before anything is entered, but even comments will mess this up
  console.log(numChildren)
  if (numChildren > 1) {
    return;
  }

  var textList = resultDict["sentences"][category];
  var categoryList = document.getElementById("list " + category);

  console.log(textList)
  for(var i = 0; i < textList.length; i++){
    // list node
    var node = document.createElement("li");
    node.classList.add("info-list-elem");

    //text
    var text = document.createElement("div");
    text.classList.add("info-list-sub");
    text.id = category + " element " + i;
    text.textContent = textList[i];

    // button
    var buttonDiv = document.createElement("div");
    buttonDiv.id = category + " button " + i;
    buttonDiv.classList.add("arrow\sbutton");
    var buttonI = document.createElement("i");
    buttonI.classList.add("material-icons");
    buttonI.style = buttonStyle;
    buttonI.textContent = "arrow_forward";

    //appending
    node.appendChild(text);
    buttonDiv.appendChild(buttonI);
    node.appendChild(buttonDiv);
    categoryList.appendChild(node);

    // button listener
    buttonDiv.addEventListener('click', 
      function() { goToHighlighted(this.id); });
  }
}

// listen for messages sent by getPagesSource.js
chrome.runtime.onMessage.addListener(function(request, sender) {
  if (request.action == "getSource") {
    
    if(request.source === null){
      message.innerText = "This isn't a Terms of Service page!";
    }

    var results = JSON.parse(request.source);

    // store the results
    searchResults = results;

    // display results
    for(var category in results["sentences"]){
      displayText(category, results);
    }

    message.innerText = "That's all we could find!";
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

    // close button (settings page)
    var closeButton = document.getElementById("close button settings");
    closeButton.addEventListener('click', closeApp);

    // back button (settings page only)
    var settingsButton = document.getElementById("back button");
    settingsButton.addEventListener('click', backToMain);

    for(var i = 0; i < filterKeys.length; i++){
      var category = filterKeys[i];
      
      // checkboxes
      var categoryCheckbox = document.getElementById(category + " checkbox");
      categoryCheckbox.addEventListener('change', 
        function() { 
          var category = this.id.split(" ")[0];
          if(this.checked) {
            document.getElementById(category).classList.remove("hidden");
          } else {
            document.getElementById(category).classList.add("hidden");
          } 
        });
    }
});

function goToSettings() {
  var settingsDiv = document.getElementById("settings box");
  settingsDiv.classList.remove("hidden");

  var mainDiv = document.getElementById("box");
  mainDiv.classList.add("hidden");
}

function backToMain() {
  var settingsDiv = document.getElementById("settings box");
  settingsDiv.classList.add("hidden");

  var mainDiv = document.getElementById("box");
  mainDiv.classList.remove("hidden");
}

function closeApp() {
  window.close();
}

function goToHighlighted(id) {

  var category = id.split(" ")[0];
  var index = id.split(" ")[2];

  var sentenceID = category + " element " + index;
  var cleanSentence = document.getElementById(sentenceID).innerHTML;
  var rawSentence = searchResults["cleanToRaw"][cleanSentence];

  var splitRaw = rawSentence.split(/<[^>]*>/);
  if(splitRaw.length > 1){
    rawSentence = splitRaw[0];
    var i = 0;
    while(rawSentence.length < 10){
      i = i + 1;
      if(i == splitRaw.length) {return;}
      rawSentence = splitRaw[i]
    }
  }

  var params = {"sentence" : rawSentence, "category" : category};

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(
      tabs[0].id, 
      {action: "scroll", source: JSON.stringify(params)}
      );
  });

  return;
}

// define an onload function: when the page is loaded,
// run the function above to grab the text
window.onload = onWindowLoad;

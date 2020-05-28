'use strict';

var filterKeys = [
    "govt", // Disclose info to the government: https://regex101.com/r/jpBIp1/2/tests
    "track", // Track you on other websites "DNT" header (Do Not Track), "track" https://regex101.com/r/c2DOeX/2
    "share", // Shares data with 3rd parties "share...information" "share...data" https://regex101.com/r/OQG4fv/2
    "sell", // Right to sell data in financial transactions https://regex101.com/r/fzEr74/2
    "copyright", // Owns copyright on your content https://regex101.com/r/STXxpi/1
    "court" // Waive right to go to court https://regex101.com/r/UY04SZ/2
]

// BUTTONs SETUP
document.addEventListener('DOMContentLoaded', function () {
    // back button
    var settingsButton = document.getElementById("back button");
    settingsButton.addEventListener('click', backToMain);

    // close button
    var closeButton = document.getElementById("close button");
    closeButton.addEventListener('click', closeApp);

    for(var i = 0; i < filterKeys.length; i++){
      var category = filterKeys[i];
      var categoryButton = document.getElementById(category);
      categoryButton.addEventListener('click', 
        () => { checked(category); });
    }
});

function closeApp() {
  window.close();
}

function backToMain() {
  window.location.href="popup.html";
}

function checked(category) {
  // Get the checkbox
  let checkBox = document.getElementById(category);
  var isChecked = checkBox.checked;

  // Get the output text
  //NEEDS TO CHANGE BECAUSE THE TEXT ELEMENT WE'RE CHANGING IS ON A DIFFERENT DOCUMENT
  let text = document.getElementById("list " + category);

  // If the checkbox is checked, display the output text
  if (isChecked){
    text.classList.remove("hidden");
  } else {
    text.classList.add("hidden");
  }
}
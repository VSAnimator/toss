'use strict';

// BUTTON SYNTAX:
document.addEventListener('DOMContentLoaded', function () {
    // back button
    var settingsButton = document.getElementById("back button");
    settingsButton.addEventListener('click', backToMain);

    // close button
    var closeButton = document.getElementById("close button");
    closeButton.addEventListener('click', closeApp);
});

function closeApp() {
  window.close();
}

function backToMain() {
  window.location.href="popup.html";
}

function checked(checkid, id) {
  // Get the checkbox
  let checkBox = document.getElementById(checkid);
  // Get the output text
  //NEEDS TO CHANGE BECAUSE THE TEXT ELEMENT WE'RE CHANGING IS ON A DIFFERENT DOCUMENT
  let text = document.getElementById(id);

  // If the checkbox is checked, display the output text
  if (checkBox.checked === true){
    text.classList.remove("hidden");
  } else {
    text.classList.add("hidden");
  }
}
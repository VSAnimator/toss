'use strict';

function closeApp() {
  console.log('close');
}

function backToMain() {
  console.log('back to main');
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
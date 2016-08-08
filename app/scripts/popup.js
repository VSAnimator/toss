'use strict';
let currentUrl;

console.log('\'Allo \'Allo! Popup running :)');

chrome.tabs.getSelected(null, function(tab) {
    currentUrl = tab.url;
    console.log('curr URL', currentUrl);
});

function setDOMInfo(info) {
  var newH1 = document.createElement('h1');
  newH1.innerHTML = info.title;
  document.getElementById('title').appendChild(newH1);

  info.sentences.forEach(function(sentence, idx) {
    var newLi = document.createElement('li');
    newLi.id = `sentence-${idx}`;
    newLi.innerHTML = sentence;
    document.getElementById('sentence-list').appendChild(newLi);
  });
}

window.addEventListener('DOMContentLoaded', function () {
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function (tabs) {
    chrome.tabs.sendMessage(
        tabs[0].id,
        {from: 'popup', subject: 'DOMInfo'},
        setDOMInfo);
  });
});


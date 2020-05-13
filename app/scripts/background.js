'use strict';

chrome.runtime.onInstalled.addListener(function (details) {
  console.log('previousVersion', details.previousVersion);
});

chrome.browserAction.setBadgeText({ text: 'Mely!' });

function sendSummary(info, tab) {
  chrome.tabs.sendMessage(tab.id, {from: 'contextMenu', subject: info});
}

chrome.contextMenus.create({
  title: 'TOS Summary',
  contexts:['selection'],
  onclick: sendSummary,
});

'use strict';

chrome.runtime.onInstalled.addListener(function (details) {
  console.log('previousVersion', details.previousVersion);
});

// this sets the icon text in the chrome toolbar
//chrome.browserAction.setBadgeText({ text: 'TOSS' });

// function sendSummary(info, tab) {
//   chrome.tabs.sendMessage(tab.id, {from: 'contextMenu', subject: info});
// }

// chrome.contextMenus.create({
//   title: 'TOS Summary',
//   contexts:['selection'],
//   onclick: sendSummary,
// });

'use strict';

console.log('this content script ran :)');

let clickedEl,
    sendAnswer = null;

const demoText = 'If you found that to be the case, that’s okay. You’ll likely find some efficiencies in the coming days that will get those times down. For example, you start to use a Text Expander snippet for your evening journal or place your supplements next to your bathroom sink. For now, let’s take a few of those extra steps off of your routine. Remember, the core purpose of evening ritual is to have a consistent step-by-step sequence you go through to get quality sleep. You can add 1 or 2 actions to set your next day up. Getting that gym bag ready or planning your next day may even help you fall asleep. But doing too much too fast means that the ritual will be difficult to maintain for the long haul.';

const demoSent = [
        "Document summarization is another.",
        "Generally, there are two approaches to automatic summarization: extraction and abstraction.",
        "Furthermore, evaluation of extracted summaries can be automated, since it is essentially a classification task.",
        "Even though automating abstractive summarization is the goal of summarization research, most practical systems are based on some form of extractive summarization.",
        "Extractive methods work by selecting a subset of existing words, phrases, or sentences in the original text to form the summary.",
        "The state-of-the-art abstractive methods are still quite weak, so most research has focused on extractive methods.",
        "These systems are known as multi-document summarization systems.",
        "People are subjective, and different authors would choose different sentences."
      ]

const query = {
  'url': `${document.location}`,
  'text': '',
  'sentnum': 8
}
const headers = {
  'X-Mashape-Key': 't51BzicIKWmshVEZAhkrffrXhTJfp115oBTjsn4KXT6UFVfX4l',
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}
const fetchURL = 'https://textanalysis-text-summarization.p.mashape.com/text-summarizer';

// OB: unburied dead code
// fetch URL summary
// var promisedFetch = fetch(fetchURL, {
//   method: 'POST',
//   headers: headers,
//   body: JSON.stringify(query)
// })
// .then(r => r.json())
// .then(answer => {
//   sendAnswer = answer;
//   sendAnswer.title = document.title;
// })
// .catch(err => {
//   console.error('ERROR', err)
// });

// Listen for messages from popup.js
chrome.runtime.onMessage.addListener(function (req, sender, res) {
  if ((req.from === 'popup') && (req.subject === 'DOMInfo')) {
    if (sendAnswer === null) promisedFetch.then(() => res(sendAnswer));
    else res(sendAnswer);

    // demo purposes
    // let x = {sentences: demoSent, title: document.title}
    // res(x);
  }
  return true;
});

// Handle context menu events
document.addEventListener('contextmenu', function(event){
  clickedEl = event.target;
}, true);

chrome.runtime.onMessage.addListener(function (req, sender, res) {
  if (req.from !== 'contextMenu') return;

  // OB: I think it'd be worth moving *all* of this code into some function that you name, e.g. `buildSummarization()` or something
  // create new elements
  let newDiv = document.createElement('div');
  newDiv.id = 'summarizeMeID'; // OB: note that html is case insensitive for tags and attributes, so you might want to go with dash-case instead of camelCase here (this applies elsewhere, too)
  let newUl = document.createElement('ul');
  newUl.id = 'summarizeMeUL';
  let closeButton = document.createElement('button');
  closeButton.id = 'summarizeMeButton';
  closeButton.innerHTML = 'Hide';

  $(closeButton).click(function() {
      // $('#summarizeMeID').toggle();
      $(newDiv).toggle();
  });

  // append elements
  newDiv.appendChild(newUl);
  clickedEl.appendChild(newDiv);
  newUl.appendChild(closeButton);

  // OB: if you plan on doing more of this building-of-DOM-nodes you might think about using a templating tool, e.g. react
  query['text'] = req.subject.selectionText;
  query['url'] = '';
  // OB: having a global `query` variable and mutating properties per request seems a little shaky. for example, if you were debugging and logged this object you'd see the state it is in for the most recent query, but multiple queries occur this could lead to confusion
  // instead, you might just create your own `submitSummarization` function that takes what it needs (here that'd probably be the selection text) and simply has the default query and headers defined locally inside that function

  fetch(fetchURL, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(query)
  })
    .then(r => r.json())
    .then(answer => {
      answer.sentences.forEach(function(sentence, idx) {
        var newLi = document.createElement('li');
        newLi.id = `sentence-${idx}`;
        newLi.innerHTML = sentence;
        newUl.appendChild(newLi);
      })
    })
    .catch(err => {
      // OB: consider bubbling erros back to the end user, i.e. actually showing some message to them (libraries `growl` and `toast` come to mind)
      console.error('ERROR', err)
    })
});

// fetch to the alchemy API
var newPre = document.createElement('pre');
newPre.id = 'summarizeMeResult';
newPre.innerHTML = 'This is the content for alchemy';
document.body.appendChild(newPre);

console.log('this is the location', document.location.href); // OB: decaying logs

fetch(`http://localhost:8000/summarize/${document.location.href}`) // OB: what about production? maybe see here: http://stackoverflow.com/questions/36339862/how-to-know-chrome-extension-is-in-development-or-production-environment
  .then(r => {
    if (r.status !== 200) return r.json().then(body => Promise.reject(body)) // OB: *any* non-200 status signals an error? what about 201 or 304? also
    return r
  })
  .then(r => r.json())
  .then(info => { document.getElementById('summarizeMeResult').innerHTML = JSON.stringify(info, null, 2) }) // OB: so the user is supposed to read JSON?
  .catch(error => console.error(error))


'use strict';

console.log('this content script ran :)');

let clickedEl,
    sendAnswer = null;

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

// fetch URL summary
var promisedFetch = fetch(fetchURL, {
  method: 'POST',
  headers: headers,
  body: JSON.stringify(query)
})
.then(r => r.json())
.then(answer => {
  sendAnswer = answer;
  sendAnswer.title = document.title;
})
.catch(err => {
  console.error('ERROR', err)
});

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

  // create new elements
  let newDiv = document.createElement('div');
  newDiv.id = 'summarizeMeID';
  let newUl = document.createElement('ul');
  newUl.id = 'summarizeMeUL';
  let closeButton = document.createElement('button');
  closeButton.id = 'summarizeMeButton';
  closeButton.innerHTML = 'Hide';

  // append elements
  newDiv.appendChild(newUl);
  clickedEl.appendChild(newDiv);
  newUl.appendChild(closeButton);

  $('#summarizeMeButton').click(function() {
      $('#summarizeMeID').toggle();
  });

  query['text'] = req.subject.selectionText;
  query['url'] = '';
  query['sentnum'] = 5;

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
      console.error('ERROR', err)
    })
});

var newPre = document.createElement('pre');
newPre.id = 'summarizeMeResult';
document.body.appendChild(newPre);

fetch(`http://localhost:8000/summarize/?url=${document.location.href}`)
  .then(r => {
    if (r.status !== 200) return r.json().then(body => Promise.reject(body));
    return r;
  })
  .then(r => r.json())
  .then(info => {
    console.log('this is info', info);
    document.getElementById('summarizeMeResult').innerHTML = JSON.stringify(info, null, 2);
    console.log('got in the info part');
    $('head').append('<ul><li><a href="#tab-description">Description</a></li><li><a href="#tab-shipping">Shipping</a></li><li><a href="#tab-returns">Returns</a></li></ul><div id="tab-description" class="mytabs"></div><div id="tab-shipping" class="mytabs"></div><div id="tab-returns" class="mytabs"></div>');
  })
  .catch(e => console.error(e));

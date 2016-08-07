'use strict';

console.log('this content script ran :)');

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
  'url': '',
  'text': '',
  'sentnum': 8
}

const headers = {
  'X-Mashape-Key': 'GKUxfWNa1wmshSuxbx1vcmEOSpAbp1Y39XmjsnUMoS1y4JZkSo',
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}

const fetchURL = 'https://textanalysis-text-summarization.p.mashape.com/text-summarizer';

// var promisedFetch = fetch(fetchURL, {
//   method: 'POST',
//   headers: headers,
//   body: JSON.stringify(query)
// });

// Listen for messages from the popup
chrome.runtime.onMessage.addListener(function (req, sender, res) {
  if ((req.from === 'popup') && (req.subject === 'DOMInfo')) {
    console.log('Content Script: runs from inside listener :)');

    var demoObj = {
      title: document.title,
      "sentences": demoSent
    }

    // query['url'] = `${document.location}`;
    // fetch(fetchURL, {
    //   method: 'POST',
    //   headers: headers,
    //   body: JSON.stringify(query)
    // })
    //   .then(r => r.json())
    //   .then(answer => {
    //     console.log('here is the answer', answer);
    //     answer.title = document.title;
    //     res(answer);
    //   })
    //   .catch(err => {
    //     console.error('ERROR', err)
    //   })

  }
  // return true;

  res(demoObj);

});

let clickedEl;

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

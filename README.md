# Summarize Me

Maintainer: [Samuel Lam](https://github.com/samuelklam)
A nifty Chrome Extension that provides a summary of the current web page or user selected text through a (right-click) context menu action.

## Examples
Browser Action
![Browser Action](app/images/browser-action-demo.png)

Context Menu
![Context Menu](app/images/context-menu-demo.png)

## Implementation
Summarize Me uses the [Text Summarization](https://market.mashape.com/textanalysis/text-summarization) API to summarize and extract important text from a URL or user selected text. Text Summarization uses Natural Language Processing and Machine Learning technologies.

This chrome extension also dabbles with [IBM Watson Developer Cloud](https://www.ibm.com/watson/developercloud/alchemy-language.html) to provide sentiment analysis of the current page.

## Test Chrome Extension
```javascript
npm install
```
To load Summarize Me, go to chrome://extensions, enable Developer mode and load app as an unpacked extension. Note: you will need to register and use your own API key from [Mashape](https://market.mashape.com/textanalysis/text-summarization).

## Contributing
External contributions in the form of feedback, bug reports or pull requests are always welcome!

// This file does all the text processing + highlightinh for this extension

// helper to check whether a piece of text contains terms of interest
function containsTOS(text){
    return (text.search("Terms of Use") != -1) || (text.search("Terms of Service") != -1);
}

// cleans up the text by removing bad characters and lines that are mostly code
function processText(text){
    text = text.replace(/[^a-z\n\s.,?!-]/gi, '')
    var lines = text.split("\n");
    var newText = "";
    for(i = 0; i < lines.length; i++){
        if(lines[i].split(" ").length > 20){
            newText += lines[i];
        }
    }
    return newText;
}

function highlightText(wordQuery){

    var instance = new Mark(document.querySelector("div"));
    var options = {"separateWordSearch": false};
    instance.mark(wordQuery, options);

    // var td = $('div:contains(' + wordQuery + ')');

    // // Make sure that this number exists
    // if(td.length > 0){
    //     var span = td.html().replace(
    //         wordQuery,'<span class="highlight-class">'+wordQuery+'</span>'
    //         );
    //     var n = td.html(span);
    // }
}

// Let's have a dictionary of regex for each ToS element, start with 6 most impt to highlight
// Making a txt file with common strings for each of these terms from TOSDR page
/*
var filterDict = {
    govt: // Disclose info to the government: "enforcement" "government request" "lawful interception" "subpoena"
    track: // Track you on other websites "DNT" header (Do Not Track), "track"
    share: // Shares data with 3rd parties "share...information" "share...data"
    sell: // Right to sell data in financial transactions
    copyright: // Owns copyright on your content
    court: // Waive right to go to court
}*/

// very basic test to isolate one sentence from instagram
function filterSentence(sentence){
    return ((sentence.search("govern") != -1) && (sentence.search("State") != -1));
}

// convert the document to plain text
function DOMtoString(document_root) {    
    // 1. Grab all the text from the page
    var pageText = '',
        node = document_root.firstChild;
    var isTOS = false;

    while (node) {
        var newString = '';
        if ((node.nodeType == Node.ELEMENT_NODE) || (node.nodeType == Node.TEXT_NODE)) {
            if(!isTOS && containsTOS(node.textContent)){ isTOS = true; }
            pageText += processText(node.textContent) + " ";
        }
        node = node.nextSibling;
    }


    // 2. very basic test to see if we are on a TOS or not
    if(!isTOS){
        return "This isn't a TOS page!";
    }

    // 3. Use "Regex" to find the appropriate sentences
    var sentences = []
    var lines = pageText.split("\n");
    for(i = 0; i < lines.length; i++){
        var curSentences = lines[i].split(".");
        for(j = 0; j < curSentences.length; j++){
            if(filterSentence(curSentences[j])){
                sentences.push(curSentences[j]);
                highlightText(curSentences[j]);
            }
        }
    }

    return sentences;
}

// send a message back to popup.js (calls the Listener there)
chrome.runtime.sendMessage({
    action: "getSource",
    source: DOMtoString(document)
});
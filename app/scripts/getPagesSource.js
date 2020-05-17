// const jsdom = require("jsdom");
// const { JSDOM } = jsdom;

// in the future, we can edit the page using sthg like:
//  https://stackoverflow.com/questions/34467627/change-dom-content-with-chrome-extension
// and this for formatting:
//  https://www.w3schools.com/jsref/jsref_bold.asp


// helper to check whether a piece of text contains terms of interest
function containsTOS(text){
    return (text.search("Terms of Use") != -1) || (text.search("Terms of Service") != -1);
}

// cleans up the text by removing bad characters and lines that are mostly code
function processText(text){
    text = text.replace(/[^a-z\n\s.]/gi, '')
    var lines = text.split("\n");
    var newText = "";
    for(i = 0; i < lines.length; i++){
        if(lines[i].split(" ").length > 20){
            newText += lines[i];
        }
    }
    return newText;
}

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

// chrome.runtime.sendMessage({
//     action: "editPage",
//     source: editPage(document)
// });




/* OLD CASES for the switch
switch (node.nodeType) {
        case Node.ELEMENT_NODE:
            if(containsTOS(node.textContent)){ isTOS = true; }
            html += node.textContent.replace(/[^a-z]/gi, '') + " "; //node.innerHTML;
            break;
        case Node.TEXT_NODE:
            if(containsTOS(node.textContent)){ isTOS = true; }
            html += node.textContent.replace(/[^a-z]/gi, '') + " "; //node.nodeValue;
            break;
        case Node.CDATA_SECTION_NODE:
            html += ""; //'<![CDATA[' + node.nodeValue + ']]>';
            break;
        case Node.COMMENT_NODE:
            html += ""; //'<!--' + node.nodeValue + '-->';
            break;
        case Node.DOCUMENT_TYPE_NODE:
            // (X)HTML documents are identified by public identifiers
            html += ""; //"<!DOCTYPE " + node.name + (node.publicId ? ' PUBLIC "' + node.publicId + '"' : '') + (!node.publicId && node.systemId ? ' SYSTEM' : '') + (node.systemId ? ' "' + node.systemId + '"' : '') + '>\n';
            break;
*/

/* Go through the nodes usig BFS
var curNode = document_root.firstChild;
    var nodeList = [];

    while(curNode){
        nodeList.push(curNode)
        curNode = curNode.nextSibling;
    }

    while(nodeList.length > 0){
        curNode = nodeList.shift();
        var curChild = curNode.firstChild;
        if(curChild && !curChild.firstChild){
            html += curNode.nodeType;
            switch (curNode.nodeType) {
                case Node.ELEMENT_NODE:
                    //html += node.
                    html += node.nodeValue + " "; //node.innerHTML;
                    break;
                case Node.TEXT_NODE:
                    html += node.textContent + " "; //node.nodeValue;
                    break;
                case Node.CDATA_SECTION_NODE:
                    html += ""; //'<![CDATA[' + node.nodeValue + ']]>';
                    break;
                case Node.COMMENT_NODE:
                    html += ""; //'<!--' + node.nodeValue + '-->';
                    break;
                case Node.DOCUMENT_TYPE_NODE:
                    html += ""; 
                    break;
                }
        }
        while(curChild){
            nodeList.push(curChild);
            curChild = curChild.nextSibling;
        }
    }

    return html;
*/
// const jsdom = require("jsdom");
// const { JSDOM } = jsdom;

// in the future, we can edit the page using sthg like:
//  https://stackoverflow.com/questions/34467627/change-dom-content-with-chrome-extension
// and this for formatting:
//  https://www.w3schools.com/jsref/jsref_bold.asp


function containsTOS(text){
    return (text.search("Terms of Use") != -1) || (text.search("Terms of Service") != -1)
}

function processText(text){
    text = text.replace(/[^a-z\n\s]/gi, '')
    var lines = text.split("\n");
    var newText = "";
    for(i = 0; i < lines.length; i++){
        if(lines[i].split(" ").length > 20){
            newText += lines[i];
        }
    }
    return newText;
}

// convert the document to plain text
// TODO: make this function extract text only
function DOMtoString(document_root) {
    var html = '',
        node = document_root.firstChild;

    var isTOS = false;

    while (node) {
        var newString = '';
        if ((node.nodeType == Node.ELEMENT_NODE) || (node.nodeType == Node.TEXT_NODE)) {
            if(!isTOS && containsTOS(node.textContent)){ isTOS = true; }
            html += processText(node.textContent) + " ";
        }
        node = node.nextSibling;
    }
    // very basic test to see if we are on a TOS or not
    if(isTOS){
        return html;
    }
    return "This isn't a TOS page!";
}


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

// send a message back to popup.js (calls the Listener there)
chrome.runtime.sendMessage({
    action: "getSource",
    source: DOMtoString(document)
});
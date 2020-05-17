// @author Rob W <http://stackoverflow.com/users/938089/rob-w>
// Demo: var serialized_html = DOMtoString(document);

const jsdom = require("jsdom");
const { JSDOM } = jsdom;

// convert the document to plain text
// TODO: make this function extract text only
function DOMtoString(document_root) {
    var html = '',
        node = document_root.firstChild;
    var html2 = document_root.documentElement.innerHTML;
    var dom = new JSDOM(html2);
    return html2;
    while (node) {
        switch (node.nodeType) {
        case Node.ELEMENT_NODE:
            //html += node.
            html += node.textContent + " "; //node.innerHTML;
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
            // (X)HTML documents are identified by public identifiers
            html += ""; //"<!DOCTYPE " + node.name + (node.publicId ? ' PUBLIC "' + node.publicId + '"' : '') + (!node.publicId && node.systemId ? ' SYSTEM' : '') + (node.systemId ? ' "' + node.systemId + '"' : '') + '>\n';
            break;
        }
        node = node.nextSibling;
    }

    // vary basic test to see if we are on a TOS or not
    if((html.search("Terms of Use") != -1)|| (html.search("Terms of Service") != -1)){
        return html;
    }

    return "This isn't a TOS page!";
}

// send a message back to popup.js (calls the Listener there)
chrome.runtime.sendMessage({
    action: "getSource",
    source: DOMtoString(document)
});
// @author Rob W <http://stackoverflow.com/users/938089/rob-w>
// Demo: var serialized_html = DOMtoString(document);

// convert the document to plain text
// TODO: make this function extract text only
function DOMtoString(document_root) {
    var html = '',
        node = document_root.firstChild;
    var x = "Hello there";
    var y = "sad";
    while (node) {
        var newString = '';
        switch (node.nodeType) {
            case Node.ELEMENT_NODE:
                newString = node.textContent + " "; //node.innerHTML;
                break;
            case Node.TEXT_NODE:
                newString = node.textContent + " "; //node.nodeValue;
                break;
            case Node.CDATA_SECTION_NODE:
                newString = ""; //'<![CDATA[' + node.nodeValue + ']]>';
                break;
            case Node.COMMENT_NODE:
                newString = ""; //'<!--' + node.nodeValue + '-->';
                break;
            case Node.DOCUMENT_TYPE_NODE:
                // (X)HTML documents are identified by public identifiers
                newString = ""; //"<!DOCTYPE " + node.name + (node.publicId ? ' PUBLIC "' + node.publicId + '"' : '') + (!node.publicId && node.systemId ? ' SYSTEM' : '') + (node.systemId ? ' "' + node.systemId + '"' : '') + '>\n';
                break;
        }
        
        if (newString.toLowerCase().indexOf("terms of use") != -1 || newString.toLowerCase().indexOf("terms of service") != -1) {
            console.log(newString);
            return x;
        }
        html += newString;
        node = node.nextSibling;
    }
    return y;
}

// send a message back to popup.js (calls the Listener there)
chrome.runtime.sendMessage({
    action: "getSource",
    source: DOMtoString(document)
});
// This file does all the text processing + highlightinh for this extension

// helper to check whether a piece of text contains terms of interest
function containsTOS(text){
    return (text.search("Terms of Use") != -1) || (text.search("Terms of Service") != -1);
}

// cleans up the text by removing bad characters and lines that are mostly code
// Maybe split on <div> and <br>
function processText(text){
    text = text.replace(/[^a-z\n\s.,?!-:;\"\']/gi, ' ');
    //text = text.replace(/([a-z]\.)([A-Z][a-z])/, "$1 $2");
    var lines = text.split(/\n\r/);
    // var lines = text.split(/<div.*>|<\/div>|<br.*>|<\/br>|\n|\r/);
    var newText = "";
    for(i = 0; i < lines.length; i++){
        //lines[i] = lines[i].replace(/[^a-z\n\s.,?!-:;\"\']/gi, ' ');
        //sublines = lines[i].split(/[^a-z\n\s.,?!-:;\"\']/gi);
        if(lines[i].split(" ").length > 0){ // Try to make sure 20 words in line?? Why? Alex prob saw something when writing this. Add a condition to make sure total length of line < 200? No lines seem too long (will put in diff part)
            newText +=  ". " + lines[i];
        }
    }
    return newText;
}

// highlight the given text of a different color for each category
// KNOWN ISSUES:
// ---> when we have hyperlinks, string doesn't get found
// ---> in a bullet list, the segement to highlight might span a transition, which causes an issue
function highlightText(wordQuery, category){

    var instance = new Mark(document.querySelector("div"));
    var options = {"separateWordSearch": false, "className": category};
    instance.mark(wordQuery, options);
}

// Let's have a dictionary of regex for each ToS element, start with 6 most impt to highlight
// Making a txt file with common strings for each of these terms from TOSDR page
var filterKeys = [
    "govt", // Disclose info to the government: https://regex101.com/r/jpBIp1/2/tests
    "track", // Track you on other websites "DNT" header (Do Not Track), "track" https://regex101.com/r/c2DOeX/2
    "share", // Shares data with 3rd parties "share...information" "share...data" https://regex101.com/r/OQG4fv/2
    "sell", // Right to sell data in financial transactions https://regex101.com/r/fzEr74/2
    "copyright", // Owns copyright on your content https://regex101.com/r/STXxpi/1
    "court" // Waive right to go to court https://regex101.com/r/UY04SZ/2
]

// Lookarounds are more concise, but slower for some of these, so avoiding using them for now
var filterDict = [
    /government request|(disclose.*legal|legal.*disclose)|subpoena|lawful interception|release/gmi, // (?=.*\bjack\b)(?=.*\bjames\b).* maybe use this lookaround syntax for disclose and legal, but it's slow!
    /DNT|track|(record.*plugin|plugin.*record)/gmi,
    /(shar.*(part|aggregate|anonymize))|((part|aggregate|anonymize).*shar)/gmi, // Lookaround version: /(?=.*shar.*)(?=.*(part|aggregate|anonymize).*)/gmi,
    /((info|data|TOS|terms).*(merge|sale|sell|acqui|bankrupt|business|insolven|transfer))|((merge|sale|sell|acqui|bankrupt|business|insolven|transfer).*(info|data|TOS|terms))/gmi, // Lookaround version: 
    /((stuff|content|submission|property).*(rights|license|property|copyright|reproduce|distribute|modify|owner))|((rights|license|property|copyright|reproduce|distribute|modify|owner).*(stuff|content|submission|property))/gmi,
    /((waive|agree).*(court|arbitration|dispute|injuncti))|((court|arbitration|dispute|injuncti).*(waive|agree))/gmi
]

var filterLength = filterDict.length;

// iterate through the filter to see if a sentence is interesting
function filterSentence(sentence){
    if (sentence.length > 1000) {
        return [];
    }

    var toReturn = [];
    for (var i = 0; i < filterLength; i++) {
        if (filterDict[i].exec(sentence) !== null) {
            toReturn.push(i);
        }
    }
    return toReturn;
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
    if(!isTOS){ // TODO: this also picks up footers...
        return null;
    }

    // 3. Use "Regex" to find the appropriate sentences
    var sentences = {} // initalize a dict storing what sentence belong to what clause
    var lines = pageText.split("\n");
    for(i = 0; i < lines.length; i++){
        var curSentences = lines[i].split(/\.(\s|\"|\')/); // Need a space to not fail on things like "U.S."
        for(j = 0; j < curSentences.length; j++){
            console.log(curSentences[j])
            curSentences[j] = curSentences[j].replace(/([a-z]\.)([A-Z][a-z\s])/g, "$1 $2"); // Gotta do this repeatedly
            console.log(curSentences[j])
            fineSentences = curSentences[j].split(/\.(\s|\"|\')/);
            for (k = 0; k < fineSentences.length; k++) {
                var filters = filterSentence(fineSentences[k]);
                if(filters.length > 0){
                    console.log(fineSentences[k])
                    // store the filters
                    for(f = 0; f < filters.length; f++){
                        var filterFound = filterKeys[filters[f]];
                        if(!(filterFound in sentences)){
                            sentences[filterFound] = [];
                        }
                        sentences[filterFound].push(fineSentences[k]);
                    }

                    // highlighting
                    // console.log(filters[0]);
                    // console.log(curSentences[j])
                    highlightText(fineSentences[k], filterKeys[filters[0]]);
                }
            }
        }
    }

    console.log(sentences)

    return JSON.stringify(sentences);
}

// send a message back to popup.js (calls the Listener there)
chrome.runtime.sendMessage({
    action: "getSource",
    source: DOMtoString(document)
});
// This file does all the text processing + highlightinh for this extension

// helper to check whether a piece of text contains terms of interest
function containsTOS(text){
    return (text.search("Terms of Use") != -1) || (text.search("Terms of Service") != -1);
}

// highlight the given text of a different color for each category
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
    // Assuming this is a legitimate sentence, apply filters
    var toReturn = [];
    for (var i = 0; i < filterLength; i++) {
        if (filterDict[i].exec(sentence) !== null) {
            toReturn.push(i);
        }
    }
    return toReturn;
}

// clean the sentence by removing extra characters + leftover html tags.
function cleanupSentence(sentence){
    if (sentence.length > 1000) {
        return "";
    }

    // Let's identify some strings that indicate parsing has messed up
    var urlCount = (sentence.match(/Url/g) || []).length; // If encoding Urls in page
    var imgCount = (sentence.match(/img|svg|png/gi) || []).length; // If code embedding images
    var slashCount = (sentence.match(/\//g) || []).length; // If url string(s)
    var colonCount = (sentence.match(/\:/g) || []).length; // If url string(s)
    var quoteCount = (sentence.match(/\"/g) || []).length; // If url string(s)

    if (urlCount > 0) { return ""; }
    if (imgCount > 0) { return ""; }
    if (slashCount > 3) { return ""; }
    if (colonCount > 3) { return ""; }
    if (quoteCount > 6) { return ""; }

    //var clean = sentence.replace(/<(div|\/div|b|\/b|br|\/br|li|\/li|ul|\/ul|p|\/p)[^>]*>/, ' ');
    var clean = sentence.replace(/<[^>]*>/gi, ""); // remove all HTML tags
    clean = clean.replace(/[^a-z\n\s.,?!-:;\"\']/gi, ' ');
    return clean;
}

// this function breaks the text into sentences base on both period and html tags.
function breakIntoSentences(text){
    var finalSentences = [];

    var firstIteration = text.split(/\.(\s|\"|\'|\))/);

    for(var k = 0; k < firstIteration.length; k++){
        var secondIteration = firstIteration[k].split(/(<b>|<br>|<div>|<li>|<ul>)/);
        for(var l = 0; l < secondIteration.length; l++){
            finalSentences.push(secondIteration[l]);
        }
    }

    return finalSentences;
}

// convert the document to plain text
function DOMtoString(document_root) {
    // 1. Grab all the text from the page
    var acceptedTags = ["A", "UL", "LI", "BR", "B", "P"];
    var all = document.getElementsByTagName("*");
    var pageText = '';
    var isTOS = false;

    // three maps:
    var keptSentences = {}; // categories -> list of cleaned sentences (for display)
    var cleanToRaw = {}; // cleaned sentence -> raw sentence (for highlighting)
    var keptIDs = {}; // categories -> list of elementIDs (for scroll)

    // iterate over all elements
    for (var i=0; i < all.length; i++) {
        var curElem = all[i];
        pageText += curElem.tagName + "\n";

        // look only at valid tags
        if(acceptedTags.indexOf(curElem.tagName) > -1){
            pageText += "\n" + curElem.innerHTML + "\n";
            var text = curElem.innerHTML;

            // basic TOS check
            if(!isTOS && containsTOS(text)){ isTOS = true; }

            // split sentences
            var curSentences = breakIntoSentences(text);

            // pass sentences through a cleanup + filters
            for(var j = 0; j < curSentences.length; j++){
                var cleanSentence = cleanupSentence(curSentences[j]);

                var filters = filterSentence(cleanSentence);
                if(filters.length > 0 && !(cleanSentence in cleanToRaw)){
                    cleanToRaw[cleanSentence] = curSentences[j];
                    
                    // add to our maps
                    for(f = 0; f < filters.length; f++){
                        var filterFound = filterKeys[filters[f]];
                        if(!(filterFound in keptSentences)){
                            keptSentences[filterFound] = [];
                            keptIDs[filterFound] = [];
                        }
                        keptSentences[filterFound].push(cleanSentence);
                        keptIDs[filterFound].push(curElem.id);
                    }          
                }

            }
        }
    }

    if(!isTOS) { return null; }

    // highlighting
    for(var category in keptSentences){
        var categoryCleanSentences = keptSentences[category];
        for(var i = 0; i < categoryCleanSentences.length; i++){
            var cleanSentence = categoryCleanSentences[i];
            highlightText(cleanToRaw[cleanSentence], category);
        }
    }
    return JSON.stringify(keptSentences);
}

// send a message back to popup.js (calls the Listener there)
chrome.runtime.sendMessage({
    action: "getSource",
    source: DOMtoString(document)
});
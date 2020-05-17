// var all = document.getElementsByTagName("div");
// var query = "Instagram";

// for(i=0; i < all.length; i++) {
//     var index = all[i].innerHTML.indexOf(query);
//     if(index > -1){
//         all[i].innerHTML.replace(query,'<span class="highlight-class">'+query+'</span>');
//     }
// }


// look at this page:
// https://9to5google.com/2015/06/14/how-to-make-a-chrome-extensions/


// Select the '<td>' that contains the number we are looking for
var wordQuery = "Instagram";
var td = $('div:contains(' + wordQuery + ')');

// Make sure that this number exists
if(td.length > 0){
	var span = td.html().replace(
		wordQuery,'<span class="highlight-class">'+wordQuery+'</span>'
		);
	var n = td.html(span);
}